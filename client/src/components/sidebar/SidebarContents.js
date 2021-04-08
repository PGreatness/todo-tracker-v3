import React            from 'react';
import SidebarHeader    from './SidebarHeader';
import SidebarList      from './SidebarList';

const SidebarContents = (props) => {
    return (
        <>
            <SidebarHeader 
                auth={props.auth} createNewList={props.createNewList}
                active={props.active}
            />
            <SidebarList
                activeid={props.activeid} handleSetActive={props.handleSetActive}
                todolists={props.todolists} createNewList={props.createNewList}
                updateListField={props.updateListField} getToDos={props.getToDos}
            />
        </>
    );
};

export default SidebarContents;