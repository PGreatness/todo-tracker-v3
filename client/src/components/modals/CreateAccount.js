import React, { useState } 	from 'react';
import { REGISTER }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';
import { disableExperimentalFragmentVariables } from '@apollo/client';

const CreateAccount = (props) => {
	const [input, setInput] = useState({ email: '', password: '', firstName: '', lastName: '' });
	const [loading, toggleLoading] = useState(false);
	const [Register] = useMutation(REGISTER);
	const [isVisible, setVisible] = useState(true);
	const [showErr, setShowErr] = useState([[''], ['']]);
	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleCreateAccount = async (e) => {
		let passwordResponse = [''];
		let emailResponse = [''];
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to register');
				return;
			}
			if (field === 'email') {
				let emailRegEx = '[a-zA-Z1-9]+(?<![^a-zA-Z1-9])@[a-zA-Z]+[1-9]?[.]{1}[a-zA-Z]+';
				if (!(new RegExp(emailRegEx).test(input[field]))) {
					emailResponse = ['This email is not valid'];
				}
			}
			if (field === 'password') {
				let passwordUppercase = new RegExp('[A-Z]')
				let passwordLowercase = new RegExp('[a-z]')
				let passwordSpecial = new RegExp('[^a-zA-Z1-9]')
				let passwordNumbers = new RegExp('[1-9]')
				let response = [''];
				if (!passwordLowercase.test(input[field]))
					response.push("Your password must have at least one lowercase character\n");
				if (!passwordUppercase.test(input[field]))
					response.push("Your password must have at least one uppercase character\n");
				if (!passwordSpecial.test(input[field]))
					response.push("Your password must have at least one special character\n");
				if (!passwordNumbers.test(input[field]))
					response.push("Your password must have at least one number\n");
				if (input[field].length < 8)
					response.push("Your password must be at least 8 characters long\n");
				passwordResponse = response;
			}
		}
		setShowErr([emailResponse, passwordResponse])
		if (emailResponse[0] !== '' || passwordResponse[0] !== '') return;
		const { loading, error, data } = await Register({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.register.email === 'already exists') {
				alert('User with that email already registered');
			}
			else {
				props.fetchUser();
			}
			props.setShowCreate(false);

		};
	};

	return (
		<div className="signup-modal">
			<WModal visible={isVisible}>
				<WMHeader>
				<WRow className="modal-col-gap signup-modal">
							<WCol size="6">
								<WInput 
									className="" onBlur={updateInput} name="firstName" labelAnimation="up" 
									barAnimation="solid" labelText="First Name" wType="outlined" inputType="text" 
								/>
							</WCol>
							<WCol size="6">
								<WInput 
									className="" onBlur={updateInput} name="lastName" labelAnimation="up" 
									barAnimation="solid" labelText="Last Name" wType="outlined" inputType="text" 
								/>
							</WCol>
						</WRow>

						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
							barAnimation="solid" labelText="Email Address" wType="outlined" inputType="text" 
						/>
						{
							showErr[0].map((emailErrs) => (
								<div className="modal-error">
									{emailErrs}
								</div>
							))
						}
						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
							barAnimation="solid" labelText="Password" wType="outlined" inputType="password" 
						/>
						{
							showErr[1].map((passErrs) => (
								<div className="modal-error">
									{passErrs}
								</div>
							))
						}
				</WMHeader>
				<WMFooter>
			<WButton className="modal-button" onClick={handleCreateAccount} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="primary">
				Submit
			</WButton>
			<WButton className="modal-button" onClick={() => {props.setShowCreate(false);setVisible(false)}} span clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="transparent">
				Close
			</WButton>
				</WMFooter>
			</WModal>
		</div>
	);
}

export default CreateAccount;
