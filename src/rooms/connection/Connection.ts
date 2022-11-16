class Connection {
  private peerConnection: RTCPeerConnection;

  constructor() {
    this.initConnection();
  }

  initConnection() {
    this.peerConnection = new RTCPeerConnection();
  }
}
