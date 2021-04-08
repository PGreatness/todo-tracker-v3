import React        from 'react';
import SidebarEntry from './SidebarEntry';

const SidebarList = (props) => {
    let lists = props.getToDos();
    let restOfList = lists.filter((item) => item.id !== props.activeid);
    let active = lists.find((item) => item.id === props.activeid);
    active = active == undefined ? [] : [active];
    restOfList = active.concat(restOfList);
    return (
        <>
            {
                restOfList &&
                restOfList.map(todo => (
                    <SidebarEntry
                        handleSetActive={props.handleSetActive} activeid={props.activeid}
                        id={todo.id} key={todo.id} name={todo.name} _id={todo._id}
                        updateListField={props.updateListField}
                    />
                ))
            }
        </>
    );
};

export default SidebarList;