import React, { useState, useEffect } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import MainContents 					from '../main/MainContents';
import SidebarContents 					from '../sidebar/SidebarContents';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import CreateAccount 					from '../modals/CreateAccount';
import { GET_DB_TODOS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateListField_Transaction, 
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction } 				from '../../utils/jsTPS';
import WInput from 'wt-frontend/build/components/winput/WInput';

const Homescreen = (props) => {

	let todolists 							= [];
	const [activeList, setActiveList] 		= useState({});
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [sorts, setSorts]                 = useState([false, false, false, false]);

	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM);
	const [applySorts]				= useMutation(mutations.APPLY_SORT);


	const { loading, error, data, refetch } = useQuery(GET_DB_TODOS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { todolists = data.getAllTodos; }

	const auth = props.user === null ? false : true;

	const refetchTodos = async (refetch) => {
		const { loading, error, data } = await refetch();
		if (data) {
			todolists = data.getAllTodos;
			if (activeList._id) {
				let tempID = activeList._id;
				let list = todolists.find(list => list._id === tempID);
				setActiveList(list);
			}
		}
	}

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchTodos(refetch);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchTodos(refetch);
		return retVal;
	}


	// Creates a default item and passes it to the backend resolver.
	// The return id is assigned to the item, and the item is appended
	//  to the local cache copy of the active todolist. 
	const addItem = async () => {
		let list = activeList;
		const items = list.items;
		let greatestID = -1;
		console.log(items)
		items.forEach((item)=>greatestID = item.id > greatestID ? item.id : greatestID);
		greatestID++;
		const newItem = {
			_id: '',
			id: greatestID,
			description: 'No Description',
			due_date: 'No Date',
			assigned_to: 'Unassigned',
			completed: false
		};
		let opcode = 1;
		let itemID = newItem._id;
		let listID = activeList._id;
		let transaction = new UpdateListItems_Transaction(listID, itemID, newItem, opcode, AddTodoItem, DeleteTodoItem);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};


	const deleteItem = async (item, index) => {
		let listID = activeList._id;
		let itemID = item._id;
		let opcode = 0;
		let itemToDelete = {
			_id: item._id,
			id: item.id,
			description: item.description,
			due_date: item.due_date,
			assigned_to: item.assigned_to,
			completed: item.completed
		}
		let transaction = new UpdateListItems_Transaction(listID, itemID, itemToDelete, opcode, AddTodoItem, DeleteTodoItem, index);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const editItem = async (itemID, field, value, prev) => {
		let flag = 0;
		if (field === 'completed') flag = 1;
		let listID = activeList._id;
		let item = activeList.items.find(todo => todo._id === itemID)[field];
		if (item === value) return;
		if (item === ('complete' === value)) return;
		let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const reorderItem = async (itemID, dir) => {
		let listID = activeList._id;
		let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const createNewList = async () => {
		const length = todolists.length
		const id = length >= 1 ? todolists[length - 1].id + Math.floor((Math.random() * 100) + 1) : 1;
		let list = {
			_id: '',
			id: id,
			name: 'Untitled',
			owner: props.user._id,
			items: [],
		}
		const { data } = await AddTodolist({ variables: { todolist: list }, refetchQueries: [{ query: GET_DB_TODOS }] });
		setActiveList(list);
		refetch();
		props.tps.clearAllTransactions();
	};

	const deleteList = async (_id) => {
		DeleteTodolist({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_TODOS }] });
		refetch();
		setActiveList({});
		props.tps.clearAllTransactions();
	};

	const updateListField = async (_id, field, value, prev) => {
		let transaction = new UpdateListField_Transaction(_id, field, prev, value, UpdateTodolistField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const handleSetActive = async (id) => {
		const todo = todolists.find(todo => todo.id === id || todo._id === id);
		if (todo !== activeList) props.tps.clearAllTransactions();
		let copy = todolists.filter((todos) => todos !== todo);
		copy = [todo].concat(copy);
		todolists = copy;
		console.log(copy);
		setActiveList(todo);
		let arrows = document.getElementsByClassName('sort-arrow');
        while (arrows[0]) arrows[0].remove();
		refetch();
	};

	// SORTS
	const descriptionSorter = (a, b) => a.description.localeCompare(b.description);
	const dateSorter = (a, b) => {
		if (a.due_date.toLowerCase() === "no date") return 1;
		if (b.due_date.toLowerCase() === 'no date') return -1;
		return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
	}
	const statusSorter = (a, b) => a.completed ? -1 : 1;
	const assignedSorter = (a, b) => a.assigned_to.localeCompare(b.assigned_to);

	const sortDescription = async() => {
		let copy = clone(activeList);
		console.log(copy);
		copy.items.sort(descriptionSorter);
		if (sorts[0]) copy.items.reverse();
		// const { data } = await applySorts({ variables: {_id : activeList._id, todolist: activeList}, refetchQueries: [{ query: GET_DB_TODOS }] });
		setSorts([!sorts[0], sorts[1], sorts[2], sorts[3]]);
		setActiveList(copy);
		refetch();
	}

	const sortDate = () => {
		let copy = clone(activeList);
		// console.log(copy);
		copy.items.sort(dateSorter);
		if (sorts[1]) copy.items.reverse();
		setSorts([sorts[0], !sorts[1], sorts[2], sorts[3]]);
		setActiveList(copy);
		refetch();
	}

	const sortStatus = () => {
		let copy = clone(activeList);
		console.log(copy);
		copy.items.sort(statusSorter);
		if (sorts[2]) copy.items.reverse();
		setSorts([sorts[0], sorts[1], !sorts[2], sorts[3]]);
		setActiveList(copy);
		refetch();
	}

	const sortAssigned = () => {
		let copy = clone(activeList);
		// console.log(copy);
		copy.items.sort(assignedSorter);
		if (sorts[3]) copy.items.reverse();
		setSorts([sorts[0], sorts[1], sorts[2], !sorts[3]]);
		setActiveList(copy);
		refetch();
	}

	const clone = (object) => JSON.parse(JSON.stringify(object));
	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(!showDelete)
	}

	return (
		<WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin}
							refetchTodos={refetch} setActiveList={setActiveList}
						/>
					</ul>
				</WNavbar>
			</WLHeader>

			<WLSide side="left">
				<WSidebar>
					{
						activeList ?
							<SidebarContents
								todolists={todolists} activeid={activeList.id} auth={auth}
								getToDos={()=>todolists}
								handleSetActive={handleSetActive} createNewList={createNewList}
								updateListField={updateListField}
								active={activeList}
							/>
							:
							<></>
					}
				</WSidebar>
			</WLSide>
			<WLMain>
				{
					activeList ? 
							<div className="container-secondary">
								<MainContents
									addItem={addItem} deleteItem={deleteItem}
									editItem={editItem} reorderItem={reorderItem}
									setShowDelete={setShowDelete}
									undo={tpsUndo} redo={tpsRedo}
									activeList={activeList} setActiveList={setActiveList}
									getActiveList={()=>activeList}
									clear={()=>props.tps.clearAllTransactions()}
									canUndo={()=>props.tps.hasTransactionToUndo()}
									canRedo={()=>props.tps.hasTransactionToRedo()}

									descSort={sortDescription}
									dateSort={sortDate}
									statusSort={sortStatus}
									assignedSort={sortAssigned}
									sorts={sorts}
								/>
							</div>
						:
							<div className="container-secondary" />
				}

			</WLMain>

			{
				showDelete && (<Delete deleteList={deleteList} activeid={activeList._id} setShowDelete={setShowDelete} />)
			}

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} refetchTodos={refetch}setShowLogin={setShowLogin} />)
			}

		</WLayout>
	);
};

export default Homescreen;
