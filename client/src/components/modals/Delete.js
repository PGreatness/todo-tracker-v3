import React, { useState } from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';
import WMFooter from 'wt-frontend/build/components/wmodal/WMFooter';

const Delete = (props) => {
    const [isVisible, setVisible] = useState(true);
    const handleDelete = async () => {
        props.deleteList(props.activeid);
        props.setShowDelete(false);
    }

    return (
        <WModal visible={isVisible}>
            <WMHeader>
                <div style={{display: "flex"}}>
                    <div className="delete-text">
                        Delete List?
                    </div>
                </div>
            </WMHeader>
            <WMFooter>
            <div style={{width: "100%", display: "flex", justifyContent: "space-around"}}>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button cancel-button" onClick={() => {props.setShowDelete(false); setVisible(false)}} wType="transparent">
                    Cancel
				</WButton>
            </div>
            </WMFooter>
        </WModal>
    );
}

export default Delete;