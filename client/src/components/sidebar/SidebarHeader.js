import React                    from 'react';
import { WButton, WRow, WCol }  from 'wt-frontend';

const SidebarHeader = (props) => {
    let empty = Object.keys(props.active).length == 0
    return (
        <WRow className='sidebar-header'>
            <WCol size="7">
                <WButton wType="texted" hoverAnimation="text-primary" className='sidebar-header-name'>
                    Todolists
                </WButton>
            </WCol>

            <WCol size="5">
                {
                    props.auth && <div className="sidebar-options">
                        <WButton className="sidebar-buttons" onClick={()=>{if (empty) props.createNewList()}} clickAnimation="ripple-light" shape="rounded" color="primary">
                            <i className="material-icons" style={{color: empty ? "" : "rgb(50,50,49)", backgroundColor: empty ? "" : "rgb(97,97,96)"}}>add</i>
                        </WButton>
                    </div>
                }
            </WCol>

        </WRow>

    );
};

export default SidebarHeader;