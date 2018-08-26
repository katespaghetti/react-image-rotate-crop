import ImageCropRotate from './ImageCropRotate.js';
import React from 'react';
import './App.scss';
// this is here temporarity

export default class App extends React.Component {
  render() {

    return(
      <div style={style}>
        <ImageCropRotate />
      </div>
    )
  }
}