import React, { useState } 	from 'react';
import { LOGIN } 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput } from 'wt-frontend';

const Login = (props) => {
	const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [Login] = useMutation(LOGIN);
	const [isVisible, setVisible] = useState(true);

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

	const handleLogin = async (e) => {

		const { loading, error, data } = await Login({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (data.login._id === null) {
			displayErrorMsg(true);
			return;
		}
		if (data) {
			props.fetchUser();
			props.refetchTodos();
			toggleLoading(false)
			props.setShowLogin(false)
		};
	};


	return (

		<WModal visible={isVisible}>
			<WMHeader>
				<div className="main-login-modal">

					<WInput className="modal-input" onBlur={updateInput} name='email' labelAnimation="up" barAnimation="solid" labelText="Email Address" wType="outlined" inputType='text' />
					<div className="modal-spacer">&nbsp;</div>
					<WInput className="modal-input" onBlur={updateInput} name='password' labelAnimation="up" barAnimation="solid" labelText="Password" wType="outlined" inputType='password' />
					{
						showErr ? <div className='modal-error'>
							{errorMsg}
						</div>
							: <div className='modal-error'>&nbsp;</div>
					}
				</div>
			</WMHeader>
			<WMFooter>
			<WButton className="modal-button" onClick={handleLogin} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
					Login
				</WButton>
			<WButton className="modal-button" onClick={() => {setVisible(false);props.setShowLogin(false)}} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="transparent">
					Close
				</WButton>
			</WMFooter>
		</WModal>
	);
}

export default Login;