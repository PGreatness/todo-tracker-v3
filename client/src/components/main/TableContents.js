import React        from 'react';
import TableEntry   from './TableEntry';

const TableContents = (props) => {

    const entries = props.activeList ? props.activeList.items : [];
    let size = -1;
    if (entries != null) size = entries.length - 1;
    return (
        entries ? <div className=' table-entries container-primary'>
            {
                entries.map((entry, index) => (
                    <TableEntry
                        data={entry} key={entry.id}
                        deleteItem={props.deleteItem} reorderItem={props.reorderItem}
                        editItem={props.editItem} index={index} lastItem={index===size}
                    />
                ))
            }

            </div>
            : <div className='container-primary' />
    );
};

export default TableContents;
