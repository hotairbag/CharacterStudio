import React, { useContext, useEffect, useState } from "react"
import styles from "./Optimizer.module.css"
import { ViewMode, ViewContext } from "../context/ViewContext"
import { SceneContext } from "../context/SceneContext"
import CustomButton from "../components/custom-button"
import { LanguageContext } from "../context/LanguageContext"
import { SoundContext } from "../context/SoundContext"
import { AudioContext } from "../context/AudioContext"
import FileDropComponent from "../components/FileDropComponent"
import { getFileNameWithoutExtension, disposeVRM, getAtlasSize } from "../library/utils"
import ModelInformation from "../components/ModelInformation"
import MergeOptions from "../components/MergeOptions"
import { local } from "../library/store"

function Optimizer() {
  const { 
    isLoading, 
    setViewMode 
  } = React.useContext(ViewContext)
  const {
    characterManager,
    animationManager,
    sceneElements,
    loraDataGenerator,
    spriteAtlasGenerator
  } = React.useContext(SceneContext)
  const { playSound } = React.useContext(SoundContext)
  const { isMute } = React.useContext(AudioContext)
  
  const [model, setModel] = useState(null);
  const [nameVRM, setNameVRM] = useState("");



  const back = () => {
    !isMute && playSound('backNextButton');
    characterManager.removeCurrentCharacter();
    characterManager.removeCurrentManifest();
    setViewMode(ViewMode.LANDING)
  }

  const getOptions = () =>{
    const currentOption = local["mergeOptions_sel_option"] || 0;
    return {
      isVrm0 : true,
      createTextureAtlas : true,
      mToonAtlasSize:getAtlasSize(local["mergeOptions_atlas_mtoon_size"] || 6),
      mToonAtlasSizeTransp:getAtlasSize(local["mergeOptions_atlas_mtoon_transp_size"] || 6),
      stdAtlasSize:getAtlasSize(local["mergeOptions_atlas_std_size"] || 6),
      stdAtlasSizeTransp:getAtlasSize(local["mergeOptions_atlas_std_transp_size"] || 6),
      exportStdAtlas:(currentOption === 0 || currentOption == 2),
      exportMtoonAtlas:(currentOption === 1 || currentOption == 2),
      ktxCompression: (local["merge_options_ktx_compression"] || false),
      twoSidedMaterial: (local["mergeOptions_two_sided_mat"] || false)
    }
  }

  const createLora = async() =>{
    const parentScene = sceneElements.parent;
    parentScene.remove(sceneElements);
    await loraDataGenerator.createLoraData('./lora-assets/manifest.json');
    parentScene.add(sceneElements);
  }
  const createSpriteAtlas = async () =>{
    const parentScene = sceneElements.parent;
    parentScene.remove(sceneElements);
    await spriteAtlasGenerator.createSpriteAtlas('./sprite-atlas-assets/manifest.json');
    parentScene.add(sceneElements);
  }

  const download = () => {

    // const vrmData = currentVRM.userData.vrm
    // console.log("VRM DATA:", vrmData);
    // downloadVRM(model, vrmData,nameVRM + "_merged", getOptions())
    characterManager.downloadVRM(nameVRM + "_merged", getOptions())

  }

  // Translate hook
  const { t } = useContext(LanguageContext)

  const handleAnimationDrop = async (file) => {
    const curVRM = characterManager.getCurrentOptimizerCharacterModel();
    if (curVRM){
      const animName = getFileNameWithoutExtension(file.name);
      const url = URL.createObjectURL(file);

      await animationManager.loadAnimation(url, false, 0, true, "", animName);

      URL.revokeObjectURL(url);
    }
    else{
      console.warn("Please load a vrm model to test animations.")
    }
  }

  const handleVRMDrop = async (file) =>{
    const url = URL.createObjectURL(file);
    await characterManager.loadOptimizerCharacter(url);
    URL.revokeObjectURL(url);

    const name = getFileNameWithoutExtension(file.name);
    setNameVRM (name);

    setModel(characterManager.getCurrentCharacterModel());
  }

  const handleFilesDrop = async(files) => {
    const file = files[0];
    // Check if the file has the .fbx extension
    if (file && file.name.toLowerCase().endsWith('.fbx')) {
      handleAnimationDrop(file);
    } 
    if (file && file.name.toLowerCase().endsWith('.vrm')) {
      handleVRMDrop(file);
    } 
  };

  return (
    <div className={styles.container}>
      <div className={`loadingIndicator ${isLoading ? "active" : ""}`}>
        <img className={"rotate"} src="ui/loading.svg" />
      </div>
      <div className={"sectionTitle"}>Optimize your character</div>
      <FileDropComponent 
         onFilesDrop={handleFilesDrop}
      />
      <MergeOptions
        showDropToDownload={true}
        showCreateAtlas = {false}
        mergeMenuTitle = {"Optimizer Options"}
      />
      <ModelInformation
        model={model}
      />
      <div className={styles.buttonContainer}>
        <CustomButton
          theme="light"
          text={t('callToAction.back')}
          size={14}
          className={styles.buttonLeft}
          onClick={back}
        />
        {/* <CustomButton
          theme="light"
          text={"debug"}
          size={14}
          className={styles.buttonCenter}
          onClick={debugMode}
        /> */}
        {(model != "")&&(
          <CustomButton
          theme="light"
          text="Download"
          size={14}
          className={styles.buttonRight}
          onClick={download}
        />)}
        {(model != "")&&(
          <CustomButton
          theme="light"
          text="Create Lora"
          size={14}
          className={styles.buttonRight}
          onClick={createLora}
        />)}
        {(model != "")&&(
          <CustomButton
          theme="light"
          text="Create Sprite Atlas"
          size={14}
          className={styles.buttonRight}
          onClick={createSpriteAtlas}
        />)}
        
        
      </div>
    </div>
  )
}

export default Optimizer
