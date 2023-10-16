import React, { useContext, useState, useEffect } from "react"
import styles from "./TraitInformation.module.css"
import MenuTitle from "./MenuTitle"
import { SceneContext } from "../context/SceneContext";
import Slider from "./Slider";
import { cullHiddenMeshes } from "../library/utils";

export default function TraitInformation({currentVRM, animationManager}){
    const {
        displayTraitOption,
        avatar
    } = useContext(SceneContext);

    const [cullOutDistance, setCullOutDistance] = useState(0); // set from the values of the trait
    const [cullInDistance, setCullInDistance] = useState(0);
    const [cullLayer, setCullLayer] = useState(0);
    const [animationName, setAnimationName] = useState(animationManager.getCurrentAnimationName());

    useEffect(() => {
        if (currentVRM != null){
            setCullLayer(currentVRM?.data?.cullingLayer);
            setCullOutDistance(currentVRM?.data?.cullingDistance[0]||0);
            setCullInDistance(currentVRM?.data?.cullingDistance[1]||0);
        }
    }, [currentVRM])

    useEffect(()=>{
        //console.log(animationManager.currentAnimationName);
        setAnimationName(animationManager.getCurrentAnimationName());
    },[animationManager.currentAnimationName])
    

    const handleCullOutChange = (event) => {
        setCullOutDistance(event.target.value);
        if ( currentVRM?.data){
            currentVRM.data.cullingDistance[0] = event.target.value;
        }
        cullHiddenMeshes(avatar);
    };

    const handleCullInChange = (event) => {
        setCullInDistance(event.target.value);
        if ( currentVRM?.data){
            currentVRM.data.cullingDistance[1] = event.target.value;
        }
        cullHiddenMeshes(avatar);
    };

    const handleCullLayerChange = (event) => {
        if (currentVRM?.data){
            setCullLayer(event.target.value);
            currentVRM.data.cullingLayer = event.target.value;
            cullHiddenMeshes(avatar);
        }
    };

    const nextAnimation = async () => {
        await animationManager.loadNextAnimation();
        setAnimationName(animationManager.getCurrentAnimationName());
    }
    const prevAnimation = async () => {
        await animationManager.loadPreviousAnimation();
        setAnimationName(animationManager.getCurrentAnimationName());
    }

    return (
        displayTraitOption != null ? (
        <div>
            <div className={styles["InformationContainerPos"]}>
                <MenuTitle title="Trait Information" width={180} right={20}/>
                <div className={styles["scrollContainer"]}>
                    <div className={styles["traitInfoTitle"]}>
                        Trait ID
                    </div>
                    <div className={styles["traitInfoText"]}>
                        {displayTraitOption?.id}
                    </div>
                    <div className={styles["traitInfoTitle"]}>
                        Trait Name
                    </div>
                    <div className={styles["traitInfoText"]}>
                        {displayTraitOption?.name}
                    </div>
                    <div className={styles["traitInfoTitle"]}>
                        Culling Layer
                    </div>
                    <div className={styles["traitInfoText"]}>
                        {displayTraitOption?.cullingLayer || "-"}
                    </div>
                    <div className={styles["traitInfoTitle"]}>
                        Description
                    </div>
                    <div className={styles["traitInfoText"]}>
                        {displayTraitOption?.description || "A nice " + displayTraitOption?.name}
                    </div>
                    <div className={styles["traitInfoTitle"]}>
                        Culling Options
                    </div>
                        <div className={styles["traitInfoText"]}>
                            Culling Layer
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={cullLayer}
                                    onChange={handleCullLayerChange}
                                    className={styles["input-box"]}
                                    step ={1}
                                />
                            <br/>
                            <br/>
                            Cull Out Distance
                            <Slider  value={cullOutDistance} onChange={handleCullOutChange} min={0} max={1} step={0.001}stepBox={0.01}/>
                            <br/>
                            Cull In Distance
                            <Slider  value={cullInDistance} onChange={handleCullInChange}  min={0} max={1} step={0.001}stepBox={0.01}/>
                        </div>
                        <div className={styles["traitInfoTitle"]}>
                            Animation
                        </div>
                        <br/>
                        <div className={styles["animationSelect"]}>
                            <button 
                                className={styles["traitInfoText"]}
                                onClick={prevAnimation}
                            >1</button>
                            <div className={styles["traitInfoText"]}>{animationName}</div>
                            <button 
                                className={styles["traitInfoText"]}
                                onClick={nextAnimation}
                            >1</button>
                        </div>
                    </div>

            </div>
        </div>
        ):(<></>)
      )
}