var contactsList			= [],
	contactInfo					= {},
	selectedContactInfo = undefined,
	root								= document.getElementsByClassName('phone-book')[0],
	addContactForm			= root.getElementsByClassName('addContactForm')[0],
	contactInfoForm			= root.getElementsByClassName('contactInfo')[0],
	editContactBtn			= contactInfoForm.querySelector('.editContact'),
	saveContactBtn			= contactInfoForm.querySelector('.saveContact'),
	deleteContactBtn		= contactInfoForm.querySelector('.deleteContact'),
	cancelEditBtn				= contactInfoForm.querySelector('.cancelEdit'),
	contactsListEl			= root.getElementsByClassName('contactsList')[0],
	searchContactForm		= root.getElementsByClassName('searchContact')[0],
	addExtraListEl			= root.getElementsByClassName('add-extra-data')[0],
	viewExtraListEl			= root.getElementsByClassName('view-extra-data')[0],
	startEdit = new Event('startEdit'),
	finishEdit = new Event('finishEdit');

addContactForm.addEventListener('submit', addContact, false);
searchContactForm.addEventListener('submit', searchContact, false);

contactInfoForm.addEventListener('finishEdit', disableContactForm, false);
contactInfoForm.addEventListener('startEdit', enableContactForm, false);

getContactsList();

contactsListEl.onclick = function(event) {
	var targetEl = event.target;
	if (targetEl.classList.contains('contactItem')) {
		var value = targetEl.getAttribute('value'),
			xhr = new XMLHttpRequest();
		console.info('contact id: ', value);
		xhr.open('GET', '/contacts/' + value);
		xhr.onreadystatechange = function() {
			var contactInfo = {};
			if (this.readyState !== 4) return;
			if (this.status === 200) {
				contactInfo = JSON.parse(this.responseText)[0];
				console.log('get contact from mongo: ', contactInfo);
				fillContactInfo(contactInfo);
			} else {
				console.warn('cannot get contact info');
			}
		};
		xhr.send();
	}
};

deleteContactBtn.onclick = function () {
	var xhr = new XMLHttpRequest(),
		id = contactInfoForm.querySelector('.contactInfo-id').value;
	if (id) {
		xhr.open('DELETE', '/contacts/' + id);
		xhr.onreadystatechange = function() {
			contactInfoForm.reset();
			getContactsList();
		};
		xhr.send();
	}
	selectedContactInfo = undefined;
	contactInfoForm.reset();
	contactInfoForm.dispatchEvent(finishEdit);
};

editContactBtn.onclick = function () {
	console.log(selectedContactInfo);
	if (!selectedContactInfo) return false;
	contactInfoForm.dispatchEvent(startEdit);
};

saveContactBtn.onclick = function () {
	var xhr 		= new XMLHttpRequest(),
		phone			= contactInfoForm.getElementsByClassName('contactInfo-phone')[0].value,
		name			= contactInfoForm.getElementsByClassName('contactInfo-name')[0].value,
		surname		= contactInfoForm.getElementsByClassName('contactInfo-surname')[0].value,
		dataObj 	= {
			'phone': 		phone,
			'name': 		name,
			'surname': 	surname,
			'extras':		[]
		},
		errorWrapperEl	= contactInfoForm.querySelector('.error'),
		errorMsgEl			= contactInfoForm.querySelector('.error .error-msg');
	console.log('extras list: ', viewExtraListEl.children);
	if (viewExtraListEl.children.length) {
		for (var i = 0; i < viewExtraListEl.children.length; i++) {
			var extrasItemEl	= viewExtraListEl.children[i],
					extrasItem		={key: '', value: ''};
			extrasItem.key 		= extrasItemEl.querySelector('.extra-key').value;
			extrasItem.value	= extrasItemEl.querySelector('.extra-value').value;
			dataObj.extras.push(extrasItem);
		}
	}
	if ((phone.length > 1) && (name.length > 1) && (surname.length > 1)) {
		xhr.open('PUT', '/contacts/' + selectedContactInfo._id);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.onreadystatechange = function () {
			if (this.readyState !== 4) return;
			if (this.status === 200) {
				console.log('Updated contact: ', this.response);
				getContactsList();
				contactInfoForm.dispatchEvent(finishEdit);
				errorWrapperEl.classList.add('d-none');
				errorMsgEl.textContent = '';
			} else {
				errorWrapperEl.classList.remove('d-none');
				errorMsgEl.textContent = xhr.responseText;
				console.warn(this.response);
			}
		};
		xhr.send(JSON.stringify(dataObj));
	} else {
		var errorArr = [];
		if (phone.length < 2)
			errorArr.push('телефон');
		if (name.length < 2)
			errorArr.push('имя');
		if (surname.length < 2)
			errorArr.push('фамилия');
		errorWrapperEl.classList.remove('d-none');
		errorMsgEl.textContent = 'Заполните: ' + errorArr.join(', ');
	}
};

cancelEditBtn.onclick = function () {
	contactInfoForm.dispatchEvent(finishEdit);
	console.log(contactInfo);
	fillContactInfo(selectedContactInfo);
};

root.onclick = function () {
	var target = event.target;

	if (target.classList.contains('addExtraItem')) {
		console.log('add extras');
		var form					= findTopParentByTag('form', target),
				extrasListEl	= form.querySelector('.extras-data-list');
		addExtraItem(extrasListEl);
	}

	if (target.classList.contains('delete-extra-item')) {
		console.log('delete extras');
		var extraContainer = findTopParentByClass('extra-data-item', target);
		extraContainer.parentNode.removeChild(extraContainer);
	}
};

root.onkeyup = function(event) {
	var targetEl = event.target;
	if (targetEl.classList.contains('phoneNumber')) {
		var value = targetEl.value;
		targetEl.value = value.replace(/\D/g, '');
	}
};

function searchContact(event) {
	event.preventDefault();
	var phone	= searchContactForm.querySelector('.searchContact-phone').value,
		name		= searchContactForm.querySelector('.searchContact-name').value,
		surname	= searchContactForm.querySelector('.searchContact-surname').value,
		xhr			= new XMLHttpRequest();
	if (phone || name || surname) {
		xhr.open('GET', '/contacts?' + 'phone=' + phone + '&name=' + name + '&surname=' + surname);
		xhr.onreadystatechange = function () {
			if (this.readyState !== 4) return;
			if (this.status === 200) {
				contactInfo = JSON.parse(this.responseText)[0];
				console.log(contactInfo);
				fillContactInfo(contactInfo);
				searchContactForm.reset();
			} else {
				console.warn('cannot get contact info');
			}
		};
		xhr.send();
	}
}

function fillContactInfo(contactObj) {
	var id			= contactObj._id ? contactObj._id : '',
		phone			= contactObj.phone,
		name			= contactObj.name,
		surname		= contactObj.surname,
		extras		= contactObj.extras ? contactObj.extras : [];
	contactInfoForm.reset();
	viewExtraListEl.innerHTML = '';
	selectedContactInfo = contactObj;
	contactInfoForm.querySelector('.contactInfo-phone').value			= phone;
	contactInfoForm.querySelector('.contactInfo-name').value			= name;
	contactInfoForm.querySelector('.contactInfo-surname').value		= surname;
	contactInfoForm.querySelector('.contactInfo-id').value				= id;
	if (extras.length) {
		for (var i = 0; i < extras.length; i++) {
			addExtraItem(viewExtraListEl, true);
			var extraItemEl = viewExtraListEl.querySelectorAll('.extra-data-item')[i];
			extraItemEl.querySelector('.extra-key').value = extras[i].key;
			extraItemEl.querySelector('.extra-value').value = extras[i].value;
		}
	}
}

function disableContactForm() {
	var inputs = this.querySelectorAll('input');
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].disabled = true;
	};

	if (this.classList.contains('contactInfo')) {
		this.querySelector('.editContact').disabled = false;
		this.querySelector('.editContact').classList.remove('d-none');

		this.querySelector('.addExtraItem').disabled = true;
		this.querySelector('.addExtraItem').classList.add('d-none');

		this.querySelector('.saveContact').disabled = true;
		this.querySelector('.saveContact').classList.add('d-none');

		this.querySelector('.cancelEdit').disabled = true;
		this.querySelector('.cancelEdit').classList.add('d-none');
	}
}

function enableContactForm() {
	var inputs = this.querySelectorAll('input');
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].disabled = false;
	};
	if (this.classList.contains('contactInfo')) {
		this.querySelector('.editContact').disabled = true;
		this.querySelector('.editContact').classList.add('d-none');

		this.querySelector('.addExtraItem').disabled = false;
		this.querySelector('.addExtraItem').classList.remove('d-none');

		this.querySelector('.saveContact').disabled = false;
		this.querySelector('.saveContact').classList.remove('d-none');

		this.querySelector('.cancelEdit').disabled = false;
		this.querySelector('.cancelEdit').classList.remove('d-none');
	}
}

function fillContactsList(dataArray) {
	// contactInfoForm.reset();
	// viewExtraListEl.innerHTML = '';
	contactsListEl.setAttribute('size', dataArray.length);
	contactsListEl.innerHTML = '';
	dataArray.forEach(function(contact, i) {
		var contactOpt = document.createElement('option');
		contactOpt.setAttribute('value', contact._id);
		contactOpt.className += ' contactItem';
		contactOpt.innerText = contact.name + ' ' + contact.surname + ': ' + contact.phone;
		contactsListEl.appendChild(contactOpt);
	})
}

function getContactsList() {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', '/contacts', true);
	xhr.onreadystatechange = function() {
		if (this.readyState !== 4) return;
		if (this.status === 200) {
			console.log(JSON.parse(this.responseText));
			contactsList = JSON.parse(this.responseText);
			size = (contactsList.length < 2) ? 2 : contactsList.length;
			fillContactsList(contactsList);
			contactsListEl.setAttribute('size', size);
		} else {
			console.warn('cannot het contacts list');
		}
	};
	xhr.send();
}

function addContact(event) {
	event.preventDefault();
	var phone					= addContactForm.querySelector('.addContact-phone').value,
		name						= addContactForm.querySelector('.addContact-name').value,
		surname					= addContactForm.querySelector('.addContact-surname').value,
		errorWrapperEl	= addContactForm.querySelector('.error'),
		errorMsgEl			= addContactForm.querySelector('.error .error-msg'),
		xhr							= new XMLHttpRequest(),
		newContact			= {
												'phone'   : phone,
												'name'    : name,
												'surname' : surname,
												'extras'	: []
											};
	if ((phone.length > 1) && (name.length > 1) && (surname.length > 1)) {
		if (addExtraListEl.children.length > 0) {
			while (addExtraListEl.children.length) {
				var item 	= addExtraListEl.children[0],
						key		=item.querySelector('.extra-key').value,
						value	=item.querySelector('.extra-value').value;
				newContact.extras.push({key: key, value: value});
				addExtraListEl.removeChild(item);
			}
		}
		xhr.open('POST', '/contacts', true);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.onreadystatechange = function() {
			if (this.readyState !== 4) return;
			if (this.status === 200) {
				console.log('Add contact: ', this.response);
				errorWrapperEl.classList.add('d-none');
				errorMsgEl.textContent = '';
				addContactForm.reset();
				getContactsList();
			} else {
				errorWrapperEl.classList.remove('d-none');
				errorMsgEl.textContent = xhr.responseText;
			}
		};
		xhr.send(JSON.stringify(newContact));
	} else {
		var errorArr = [];
		if (phone.length < 2)
			errorArr.push('телефон');
		if (name.length < 2)
			errorArr.push('имя');
		if (surname.length < 2)
			errorArr.push('фамилия');
		errorWrapperEl.classList.remove('d-none');
		errorMsgEl.textContent = 'Заполните: ' + errorArr.join(', ');
	}
}

function addExtraItem(listEl, disable) {
	var containerEl = document.createElement('div');
	containerEl.className = 'row mt-3 extra-data-item';
	containerEl.innerHTML = '<div class="form-group col-4">' +
													'<input type="text" class="form-control extra-key" placeholder="Поле">\n' +
													'</div>\n' +
													'<div class="col-8">\n' +
													'<div class="input-group">\n' +
													'<input type="text" class="form-control extra-value" placeholder="Значение">\n' +
													'<span class="input-group-btn">\n' +
													'<input class="btn btn-danger delete-extra-item" type="button" value="-">\n' +
													'</span>\n' +
													'</div>\n' +
													'</div>';
	if (disable === true) {
		for (var i = 0; i < containerEl.querySelectorAll('input').length; i++ ) {
			containerEl.querySelectorAll('input')[i].disabled = true;
		}
	}
	listEl.appendChild(containerEl);
}

function findTopParentByClass(parentClass, childNode) {
	var parentNode = childNode.parentNode;

	while(!parentNode.classList.contains(parentClass)) {
		parentNode = parentNode.parentNode;
	}

	return parentNode;
}

function findTopParentByTag(parentTag, childNode) {
	var parentNode = childNode.parentNode;

	while(!(parentNode.tagName === parentTag.toUpperCase())) {
		parentNode = parentNode.parentNode;
	}

	return parentNode;
}