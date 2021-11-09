import React from "react";
import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import PlayList from "../PlayList/PlayList";
import Spotify from "../../util/Spotify";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playListName: "myPlayList",
      playListTracks: [],
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlayList = this.savePlayList.bind(this);
    this.search = this.search.bind(this);
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({searchResults: searchResults})
    });
  }

  addTrack(track) {
    let tracks = this.state.playListTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({playListTracks: tracks})
  }

  removeTrack(track) {
    let tracks = this.state.playListTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playListTracks: tracks});
    
  }

  updatePlayListName(name) {
    this.setState({playListName: name});
  }

  savePlayList() {
    const trackURIs = this.state.playListTracks.map(track => track.uri);
    Spotify.savePlayList(this.state.playListName, trackURIs).then(() => {
      this.setState({
        playListName: 'New Playlist',
        playListTracks: []
      });
    });
  }

  

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <PlayList
              playListName={this.state.playListName}
              playListTracks={this.state.playListTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlayListName}
              onSave={this.savePlayList}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
