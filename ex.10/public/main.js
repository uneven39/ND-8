var root					= document.querySelector('.tasks-app'),
	usersListEl			= root.querySelector('.users-list'),
	newUserForm			= root.querySelector('.users-new'),
	newUserNameEl		=	newUserForm.querySelector('.users-new-value'),
	userEditForm		= root.querySelector('.users-edit'),
	userUpdateBtn		= userEditForm.querySelector('.user-edit-confirm'),
	userDeleteBtn		= userEditForm.querySelector('.user-delete-confirm'),
	currentUser			= undefined,
	newTaskForm			= root.querySelector('.tasks-new');

getUsers();

usersListEl.size = 2;

newUserNameEl.onkeyup		= refreshAddUserBtn;
newUserNameEl.onchange	= refreshAddUserBtn;

newUserForm.addEventListener('submit', createUser, false);

newTaskForm.addEventListener('submit', createTask, false);
newTaskForm.onkeyup			= refreshAddTaskBtn;
newTaskForm.onchange		= refreshAddTaskBtn;

usersListEl.onclick = function(event) {
	var target = event.target;
	if (target.tagName === 'OPTION') {
		console.log('Current user: ', target.innerText, target.value);
		currentUser = {id: target.value, name: target.innerText};
		var editControls = userEditForm.getElementsByTagName('input');
		for (var i = 0; i < editControls.length; i++) {
			editControls[i].disabled = false;
		}
	}
};

usersListEl.onblur = function() {
	currentUser = undefined;
	userEditForm.reset();
	var editControls = userEditForm.getElementsByTagName('input');
	for (var i = 0; i < editControls.length; i++) {
		editControls[i].disabled = true;
	}
};

userDeleteBtn.onclick = function() {
	var xhr = new XMLHttpRequest();
	if (currentUser) {
		xhr.open('DELETE', '/users/' + currentUser.id);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.onreadystatechange = function() {
			if (this.readyState !== 4) return;
			if (this.status === 200) {
				console.log('Delete user: ', this.response);
				getUsers();
			} else {
				console.warn('Delete user error: ', this.response);
			}
			currentUser = undefined;
			userEditForm.reset();
			var editControls = userEditForm.getElementsByTagName('input');
			for (var i = 0; i < editControls.length; i++) {
				editControls[i].disabled = true;
			}
		};
		xhr.send();
	}
};

userUpdateBtn.onclick = function () {
	var xhr = new XMLHttpRequest();
	if (currentUser) {
		var body = {name: userEditForm.querySelector('.users-edit-value').value};
		xhr.open('PUT', '/users/' + currentUser.id);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.onreadystatechange = function() {
			if (this.readyState !== 4) return;
			if (this.status === 200) {
				console.log('Update user: ', this.response);
				getUsers();
			} else {
				console.warn('Update user error: ', this.response);
			}
			currentUser = undefined;
			userEditForm.reset();
			var editControls = userEditForm.getElementsByTagName('input');
			for (var i = 0; i < editControls.length; i++) {
				editControls[i].disabled = true;
			}
		};
		xhr.send(JSON.stringify(body));
	}
};

function createUser(event) {
	event.preventDefault();
	var xhr			= new XMLHttpRequest(),
		body			= newUserNameEl.value ? {name: newUserNameEl.value} : null;

	if (body) {
		xhr.open('POST', '/users', true);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.onreadystatechange = function() {
			if (this.readyState !== 4) return;
			if (this.status === 200) {
				newUserForm.reset();
				newUserForm.querySelector('input[type=submit]').disabled = true;
				console.log('New user: ', this.response);
				getUsers();
			} else {
				console.warn('New user error: ', this.response);
			}
		};
		xhr.send(JSON.stringify(body));
	}
}

function getUsers() {
	var xhr = new XMLHttpRequest();

	xhr.open('GET', '/users');
	xhr.onreadystatechange = function () {
		if (this.readyState !== 4) return;
		if (this.status === 200) {
			console.log('Users list: ', this.response);
			var users	= JSON.parse(this.response),
					count	= users.length;
			usersListEl.innerHTML	=	'';
			for (var i = 0; i < count; i++) {
				var userOpt	=	document.createElement('option');
				userOpt.value			= users[i]._id;
				userOpt.innerText	= users[i].name;
				usersListEl.appendChild(userOpt);
			}
			usersListEl.size	=	(count < 2) ? 2 : count;
		} else {
			console.warn('Users list error: ', this.response);
		}
	};
	xhr.send();
}

function refreshAddUserBtn() {
	if (this.value.length > 0) {
		newUserForm.querySelector('input[type=submit]').disabled = false;
	} else {
		newUserForm.querySelector('input[type=submit]').disabled = true;
	}
}

function createTask(event) {
	event.preventDefault();
	var title				= newTaskForm.querySelector('.tasks-new-title').value,
		description		= newTaskForm.querySelector('.tasks-new-description').value,
		user					= newTaskForm.querySelector('.tasks-new-user').value,
		newTask				= {
										title: title,
										description: description,
										user: user,
									},
		xhr						= new XMLHttpRequest();

	if (title && description && user) {
		xhr.open('POST', '/tasks');
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.onreadystatechange = function () {
			if (this.readyState !== 4) return;
			if (this.status === 200) {
				console.log('New task: ', this.response);
			} else {
				console.warn('New task error: ', this.response);
			}
		};
		xhr.send(JSON.stringify(newTask));
	}

}

function refreshAddTaskBtn(event) {
	var target = event.target;
	if ((target.tagName === 'INPUT') || (target.tagName === 'TEXTAREA')) {
		var newTaskControls		= newTaskForm.querySelectorAll('.form-control'),
				newTaskConfirmBtn	= newTaskForm.querySelector('input[type=submit]'),
				formIsFilled			=	true;
		for (var i = 0; i < newTaskControls.length; i++) {
			if (!newTaskControls[i].value)
				formIsFilled = false;
		}
		if (formIsFilled)
			newTaskConfirmBtn.disabled = false;
		else
			newTaskConfirmBtn.disabled = true;
	}
}