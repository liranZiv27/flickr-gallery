import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth()
    };
  }

  getGalleryWidth(){
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  updateDimensions() {
    this.setState({ galleryWidth: this.getGalleryWidth() })
  }

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          this.setState({images: res.photos.photo});
          this.updateDimensions();
        }
      });
  }

  componentDidMount() {
    window.addEventListener('resize', () => { this.updateDimensions() });
    this.getImages(this.props.tag);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  deleteImage(imageId) {
    const updatedImages = this.state.images.filter(image => image.id !== imageId);
    this.setState({images: updatedImages});
  }

  render() {
    return (
      <div className="gallery-root" >
        {this.state.images.map(dto => {
          return <Image
            key={'image-' + dto.id}
            dto={dto}
            galleryWidth={this.state.galleryWidth}
            onDelete={() => { this.deleteImage(dto.id) }}/>;
        })}
      </div>
        );
  }
}

export default Gallery;
