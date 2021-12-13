import { Component } from "react";
import "./index.css";

class EditUsersList extends Component {
  state = { updateUserList: {} };

  componentDidMount() {
    this.updateUsersDetails();
  }

  updateUsersDetails = () => {
    const { userDetails } = this.props;
    const newUser = {
      id: userDetails.id,
      name: userDetails.name,
      email: userDetails.email,
      role: userDetails.role,
      select: userDetails.select,
    };
    this.setState({ updateUserList: newUser });
  };

  onChangeInput = (event) => {
    const { updateUserList } = this.state;
    const inputName = event.target.name;
    const inputValue = event.target.value;
    const newUserData = { ...updateUserList };
    newUserData[inputName] = inputValue;
    this.setState({ updateUserList: newUserData });
  };

  onClickSave = () => {
    const { saveChanges } = this.props;
    const { updateUserList } = this.state;
    saveChanges(updateUserList);
  };

  onClickCancel = (id) => {
    const { cancelChanges } = this.props;
    cancelChanges(id);
  };

  render() {
    const { updateUserList } = this.state;

    return (
      <tr>
        <td>
          <input type="checkbox" />
        </td>
        <td>
          <input
            type="text"
            name="name"
            onChange={this.onChangeInput}
            value={updateUserList.name}
          />
        </td>
        <td>
          <input
            type="email"
            name="email"
            onChange={this.onChangeInput}
            value={updateUserList.email}
          />
        </td>
        <td>
          <input
            type="text"
            name="role"
            onChange={this.onChangeInput}
            value={updateUserList.role}
          />
        </td>
        <td>
          <button
            type="button"
            onClick={this.onClickSave}
            className="edit-button"
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={this.onClickCancel}
            className="cancel-button"
          >
            cancel
          </button>
        </td>
      </tr>
    );
  }
}

export default EditUsersList;
