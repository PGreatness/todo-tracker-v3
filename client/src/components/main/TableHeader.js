import React from 'react';

import { WButton, WRow, WCol } from 'wt-frontend';

const TableHeader = (props) => {

    const buttonStyle = props.disabled ? ' table-header-button-disabled ' : 'table-header-button ';
    const clickDisabled = () => { };

    const handleDescSort = (e) => {
        props.sortDesc();
        let arrows = document.getElementsByClassName('sort-arrow');
        while (arrows[0]) arrows[0].remove();
        e.currentTarget.innerHTML = !props.sorts[0] ?
            `Task<i class='material-icons sort-arrow'>arrow_upward</i>` :
            `Task<i class='material-icons sort-arrow'>arrow_downward</i>`;
    }

    const handleDateSort = (e) => {
        props.sortDate();
        let arrows = document.getElementsByClassName('sort-arrow');
        while (arrows[0]) arrows[0].remove();
        e.currentTarget.innerHTML = !props.sorts[1] ?
            `Due Date<i class='material-icons sort-arrow'>arrow_upward</i>` :
            `Due Date<i class='material-icons sort-arrow'>arrow_downward</i>`;
    }

    const handleStatusSort = (e) => {
        props.sortStatus();
        let arrows = document.getElementsByClassName('sort-arrow');
        while (arrows[0]) arrows[0].remove();
        e.currentTarget.innerHTML = !props.sorts[2] ?
            `Status<i class='material-icons sort-arrow'>arrow_upward</i>` :
            `Status<i class='material-icons sort-arrow'>arrow_downward</i>`;
    }

    const handleAssignedSort = (e) => {
        props.sortAssigned();
        let arrows = document.getElementsByClassName('sort-arrow');
        while (arrows[0]) arrows[0].remove();
        console.log(props.sorts[3]);
        e.currentTarget.innerHTML = !props.sorts[3] ?
            `Assigned To<i class='material-icons sort-arrow'>arrow_upward</i>` :
            `Assigned To<i class='material-icons sort-arrow'>arrow_downward</i>`;
    }

    return (
        <WRow className="table-header">
            <WCol size="3">
                <WButton className='table-header-section' wType="texted" onClick={handleDescSort}>Task</WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType="texted" onClick={handleDateSort}>Due Date</WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType="texted"  onClick={handleStatusSort}>Status</WButton>
            </WCol>

            <WCol size="2">
                <WButton className='table-header-section' wType='texted' onClick={handleAssignedSort}>Assigned To</WButton>
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