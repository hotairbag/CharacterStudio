import React from 'react';
import styles from './View.module.css';
import { ViewMode, ViewContext } from '../context/ViewContext';
import Chat from '../components/Chat';

function ViewComponent() {
    const { setViewMode } = React.useContext(ViewContext);

    const back = () => {
        console.log('back');
        setViewMode(ViewMode.SAVE)
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={back}>Back</button>
            </div>
            <Chat />
        </div>
    );
}

export default ViewComponent;