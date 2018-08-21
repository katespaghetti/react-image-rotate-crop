import ImageCropRotate from './ImageCropRotate.js';
import React from 'react';
import './App.scss';
// this is here temporarity

export default class App extends React.Component {
  render() {
    const style= {
      border: "1px solid red"
    }

    return(
      <div style={style}>
        <ImageCropRotate />
      </div>
    )
  }
}