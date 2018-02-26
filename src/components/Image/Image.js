import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    onDelete: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.rotateImage = this.rotateImage.bind(this);
    this.state = {
      size: 200,
      rotation: 0
    };
  }

  calcImageSize(galleryWidth = this.props.galleryWidth) {
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  rotateImage() {
    let newRotation = this.state.rotation + 90;
    if (newRotation >= 360) {
      newRotation -= 360;
    }
    this.setState({
      rotation: newRotation
    })
  }

  componentWillReceiveProps(newProps) {
    if (this.props.galleryWidth !== newProps.galleryWidth) {
      this.calcImageSize(newProps.galleryWidth);
    }
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  render() {
    const rotation = this.state.rotation;
    return (
      <div
        className="image-root"
        style={{
          transform: `rotate(${rotation}deg)`,
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}
        >
        <div style={{transform: `rotate(-${rotation}deg)`}}>
          <FontAwesome
            onClick={this.rotateImage}
            className="image-icon"
            name="sync-alt"
            title="rotate"/>
          <FontAwesome
            onClick={this.props.onDelete}
            className="image-icon"
            name="trash-alt"
            title="delete"/>
          <FontAwesome className="image-icon" name="expand" title="expand"/>
        </div>
      </div>
    );
  }
}

export default Image;
