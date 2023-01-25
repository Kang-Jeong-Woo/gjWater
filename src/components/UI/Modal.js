import {Fragment, useContext} from 'react';
import ReactDOM from 'react-dom';

import classes from './Modal.module.css';
import ChartContext from "../../store/chart-context";

const Backdrop = (props) => {
    return <div className={classes.backdrop} onClick={props.onClose}/>;
};

const ModalOverlay = (props) => {
    const chartCtx = useContext(ChartContext);
    return (
        <div className={classes.modal}>
            <div className={classes.content}>{chartCtx.name}</div>
        </div>
    );
};

const portalElement = document.getElementById('overlay-root');

const Modal = (props) => {
    return (
        <Fragment>
            {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, portalElement)}
            {ReactDOM.createPortal(
                <ModalOverlay>{props.children}</ModalOverlay>,
                portalElement
            )}
        </Fragment>
    );
};

export default Modal;