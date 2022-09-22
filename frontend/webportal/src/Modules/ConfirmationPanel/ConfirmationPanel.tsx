import { useState } from "react";
import Header from "./Header";
import HelloScreen from './HelloScreen';
import CentralBox from './CentralBox';
import styles from "./ConfirmationPanel.module.css";


const ConfirmationPanel = () => {
    const [helloScreen, renderHelloScreen] = useState(true);

    const hideHelloScreen = () => {
        renderHelloScreen(false);
    }

    const showHelloScreen = () => {
        renderHelloScreen(true);
    }

    if(helloScreen) {
        return <HelloScreen onClick={hideHelloScreen}/>;
    }
    else{
        return (
            <div className={styles.main}>
                <Header/>
                <div className={styles.centralBoxWrapper}>
                    <CentralBox showHelloScreen={showHelloScreen}/>
                </div>
                
            </div>
            
        );
    }
    
}

export default ConfirmationPanel;