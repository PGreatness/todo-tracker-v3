import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const clickDisabled = () => { };

    return (
        <WRow className="table-header">
            <WCol size="3">
                <WButton className='table-header-section' wType="texted" onClick={()=>{console.log("hel");props.sortDesc()}}>Task</WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType="texted">Due Date</WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType="texted" >Status</WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType='texted'>Assigned To</WButton>
            </WCol>

            <WCol size="3">
                <div className="table-header-buttons">
                    <WButton className={`${buttonStyle} undo-redo`} onClick={props.undo} wType='text' clickAnimation='ripple-light' style={{backgroundColor: "rgb(64, 69, 78)"}}>
                        <i className='material-icons' style={{color: props.canUndo() ? "" : "rgb(97, 97, 96)"}}>undo</i>
                    </WButton>
                    <WButton className={`${buttonStyle} undo-redo`} onClick={props.redo} wType='text' clickAnimation='ripple-light' style={{backgroundColor: "rgb(64, 69, 78)"}}>
                        <i className='material-icons' style={{color: props.canRedo() ? "" : "rgb(97, 97, 96)"}}>redo</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.addItem} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">add_box</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : props.setShowDelete} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">delete_outline</i>
                    </WButton>
                    <WButton onClick={props.disabled ? clickDisabled : () => {props.clear();props.setActiveList({})}} wType="texted" className={`${buttonStyle}`}>
                        <i className="material-icons">close</i>
                    </WButton>
                </div>
            </WCol>

        </WRow>
    );
};

export default TableHeader;