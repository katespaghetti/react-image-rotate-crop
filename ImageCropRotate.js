import React, { PureComponent } from 'react';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';
import { getCroppedImg, getRotatedImg } from './cropRotateUtils';
import { defaultImage } from './defaultImage.jpeg';

export default class ImageCropRotate extends PureComponent {
	state = {
		file: "",
        imagePreviewUrl: null
	}

	handleSubmit = (e) => {
	    console.log("in the submit");
	}

    handleImageChange = (e) => {
	    e.preventDefault();

	    let reader = new FileReader();
	    let file = e.target.files[0];

	    reader.onloadend = () => {
			this.setState({
				file,
				imagePreviewUrl: reader.result
			});
	    }

	    reader.readAsDataURL(file)
	}

	render() {
		return (
			<div>
				<form onSubmit={(e)=>this.handleSubmit(e)}>
	              	<label>
	              		Choose Image
		                <input
	                      type="file"
	                      accept="image/*"
	                      onChange={(e)=>this.handleImageChange(e)} 
	                      className="choose-file-button" />
		            </label>
	          	</form>
	          	
	          	<img src={this.state.imagePreviewUrl} />
          	</div>
		)
	}
}

