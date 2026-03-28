// webrtc-connection.js - WebRTC signaling and data channel
class WebRTCConnection {
  constructor(roomCode, isHost = true) {
    this.roomCode = roomCode;
    this.isHost = isHost;
    this.peerConnection = null;
    this.dataChannel = null;
    this.messageHandlers = [];
    this.connectionStatus = 'disconnected';
    
    // STUN servers for NAT traversal
    this.configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ]
    };
  }

  async initialize() {
    this.peerConnection = new RTCPeerConnection(this.configuration);
    
    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignaling({ type: 'ice', candidate: event.candidate });
      }
    };
    
    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection.connectionState;
      this.connectionStatus = state;
      console.log('Connection state:', state);
      
      if (state === 'connected') {
        this.onConnected();
      } else if (state === 'disconnected' || state === 'failed') {
        this.onDisconnected();
      }
    };
    
    if (this.isHost) {
      // Create data channel for host
      this.dataChannel = this.peerConnection.createDataChannel('chess');
      this.setupDataChannel();
      
      // Create offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      this.sendSignaling({ type: 'offer', sdp: offer });
    } else {
      // Handle remote data channel for client
      this.peerConnection.ondatachannel = (event) => {
        this.dataChannel = event.channel;
        this.setupDataChannel();
      };
    }
    
    return true;
  }

  setupDataChannel() {
    if (!this.dataChannel) return;
    
    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
      this.connectionStatus = 'connected';
      this.onConnected();
    };
    
    this.dataChannel.onclose = () => {
      console.log('Data channel closed');
      this.connectionStatus = 'disconnected';
      this.onDisconnected();
    };
    
    this.dataChannel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(message));
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  }

  async handleSignaling(message) {
    if (!this.peerConnection) return;
    
    try {
      switch(message.type) {
        case 'offer':
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
          const answer = await this.peerConnection.createAnswer();
          await this.peerConnection.setLocalDescription(answer);
          this.sendSignaling({ type: 'answer', sdp: answer });
          break;
          
        case 'answer':
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
          break;
          
        case 'ice':
          if (message.candidate) {
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
          }
          break;
      }
    } catch (error) {
      console.error('Error handling signaling:', error);
    }
  }

  sendSignaling(message) {
    // Store in localStorage for demo (in production, use a signaling server)
    const key = `signaling_${this.roomCode}`;
    const existing = localStorage.getItem(key);
    const messages = existing ? JSON.parse(existing) : [];
    messages.push(message);
    localStorage.setItem(key, JSON.stringify(messages));
    
    // Trigger storage event for other window
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(messages) }));
  }

  checkSignaling() {
    const key = `signaling_${this.roomCode}`;
    const existing = localStorage.getItem(key);
    if (existing) {
      const messages = JSON.parse(existing);
      messages.forEach(msg => this.handleSignaling(msg));
      localStorage.removeItem(key);
    }
  }

  sendMessage(type, data) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      const message = { type, data, timestamp: Date.now() };
      this.dataChannel.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  onConnected() {
    console.log('Connected to peer');
  }

  onDisconnected() {
    console.log('Disconnected from peer');
  }

  close() {
    if (this.dataChannel) {
      this.dataChannel.close();
    }
    if (this.peerConnection) {
      this.peerConnection.close();
    }
  }
}

// Simple signaling using localStorage events (for demo without server)
class SimpleSignaling {
  static init(roomCode, onMessage) {
    const key = `signaling_${roomCode}`;
    
    window.addEventListener('storage', (event) => {
      if (event.key === key && event.newValue) {
        const messages = JSON.parse(event.newValue);
        messages.forEach(message => onMessage(message));
      }
    });
  }
  
  static send(roomCode, message) {
    const key = `signaling_${roomCode}`;
    const existing = localStorage.getItem(key);
    const messages = existing ? JSON.parse(existing) : [];
    messages.push(message);
    localStorage.setItem(key, JSON.stringify(messages));
  }
}