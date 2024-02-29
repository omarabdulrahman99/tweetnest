const validateFields = (fieldname, value) => {
		// individual fields and also full submission check, all fields at same time again.
		let errors = [];
		if (!value) {
			errors.push('Value required.');
			return errors;
		}
		switch(fieldname) {
		case 'email':
	    let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
	    if (!emailRegex.test(value)) {
	    	errors.push('Invalid email format.');
	    }
			break;
		case 'display_name':
			if (value.length < 5 || value.length > 20) {
				errors.push('Choose a name between 5 and 20 characters');
			}
			break;
		case 'password':
			if (value.length < 5 || value.length > 15) {
				errors.push('Choose a password between 8 and 15 characters');
			}
			break;
		default:
			return [];
			break;
		}
		return errors;
	};

export default validateFields;