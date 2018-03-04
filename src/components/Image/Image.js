import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Lightbox from 'react-image-lightbox';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state = {
      size: 200,
      rotateDeg: 0,
      isOpen: false
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  updateWindowDimensions() {
    this.calcImageSize();
  }

  componentDidMount() {
    this.calcImageSize();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  rotateImage(){
    this.setState({rotateDeg: (this.state.rotateDeg+90)%360});
  }

  render() {
    const {size, rotateDeg, isOpen} = this.state;
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: size + 'px',
          height: size + 'px',
          transform: `rotate(${rotateDeg}Deg)`
        }}
        >
        {isOpen && (
          <Lightbox
            mainSrc={this.urlFromDto(this.props.dto)}
            onCloseRequest={() => this.setState({isOpen: false})}
          />
        )}

        <div style={{transform: `rotate(-${rotateDeg}Deg)`}}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={() => this.rotateImage()}/>
          <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={() => this.props.deleteImage()}/>
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={() => this.setState({isOpen: true})}/>
        </div>
      </div>
    );
  }
}

export default Image;
