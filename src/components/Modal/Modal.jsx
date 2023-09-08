import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './Modal.module.css';
import { createPortal } from 'react-dom';

const modalRoot = document.querySelector('#modal-root');

class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    document.body.classList.add('modal-open');
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    document.body.classList.remove('modal-open');
  }

  handleKeyDown = e => {
    if (e.code === 'Escape') {
      this.props.onClose();
    }
  };

  handleBackdropClick = event => {
    console.log(event.currentTarget);
    if (event.currentTarget === event.target) {
      this.props.onClose();
    }
  };

  render() {
    return createPortal(
      <div className={css.backdrop} onClick={this.handleBackdropClick}>
        <div className={css.modalContent}>
          <img className={css.imgForModal} src={this.props.image} alt="" />
        </div>
      </div>,
      modalRoot
    );
  }
}

export default Modal;

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
};
