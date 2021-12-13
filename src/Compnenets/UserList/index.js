import { Component } from "react";
import ListItem from "../ListItem";
import EditUsersList from "../EditUsersList";

import ReactPaginate from "react-paginate";
import Loader from "react-loader-spinner";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class UserList extends Component {
  state = {
    usersListData: [],
    searchInput: "",
    page: 1,
    noOfItems: 10,
    isLoading: true,
    apiStatus: apiStatusConstants.initial,
    editUserDetails: null,
  };

  componentDidMount() {
    this.getUsersList();
  }

  getUsersList = async () => {
    this.setState({
      isLoading: true,
      apiStatus: apiStatusConstants.inProgress,
    });
    const url = `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json?`;
    const options = { method: "GET" };
    const response = await fetch(url, options);
    if (response.ok === true) {
      const data = await response.json();
      const fetchedData = data.map((eachUser) => ({
        ...eachUser,
        select: false,
      }));

      this.setState({
        usersListData: fetchedData,
        isLoading: false,
        apiStatus: apiStatusConstants.success,
      });
    } else {
      this.state({ apiStatus: apiStatusConstants.failure });
    }
  };

  onChangeSearchInput = (event) => {
    this.setState({ searchInput: event.target.value });
  };

  onDeleteItem = (id) => {
    const { usersListData } = this.state;
    const updatedData = usersListData.filter(
      (eachUserData) => eachUserData.id !== id
    );
    this.setState({ usersListData: updatedData });
  };

  onChecked = (id) => {
    const { usersListData } = this.state;
    const updatedCheckboxData = usersListData.map((eachUser) => {
      if (eachUser.id === id) {
        eachUser.select = !eachUser.select;
      }
      return eachUser;
    });
    this.setState({ usersListData: updatedCheckboxData });
  };

  onSelectAll = (event) => {
    const { usersListData, page } = this.state;
    const selectedUserData = usersListData
      .slice(page * 10 - 10, page * 10)
      .map((eachUser) => {
        eachUser.select = event.target.checked;
        return eachUser;
      });
    //   console.log(selectedUserData)
    usersListData.splice(page * 10 - 10, 10, ...selectedUserData);
    this.setState({ usersListData: usersListData });
  };

  deletingMultipleItems = () => {
    const { usersListData } = this.state;
    const remainingUserData = usersListData.filter(
      (eachUser) => !eachUser.select
    );
    this.setState({ usersListData: remainingUserData });
  };

  editUserItem = (id) => {
    const { editUserDetails } = this.state;
    editUserDetails
      ? this.setState({ editUserDetails: null })
      : this.setState({ editUserDetails: id });
  };

  saveChanges = (newUser) => {
    const { usersListData } = this.state;
    const savedUserData = usersListData.map((eachUser) => {
      if (eachUser.id === newUser.id) return newUser;
      return eachUser;
    });
    this.setState({ usersListData: savedUserData, editUserDetails: null });
  };

  handlePageClick = (data) => {
    this.setState((prevsState) => ({ page: data.selected + 1 }));
  };

  renderUsersLists = () => {
    const { usersListData, page, noOfItems, searchInput, editUserDetails } =
      this.state;
    const indexOfLastItem = page * noOfItems;
    const indexOfFirstItem = indexOfLastItem - noOfItems;
    const currentItem = usersListData.slice(indexOfFirstItem, indexOfLastItem);
    const searchResults = currentItem.filter((eachData) => {
      return (
        eachData.name.toLowerCase().includes(searchInput) ||
        eachData.email.toLowerCase().includes(searchInput) ||
        eachData.role.toLowerCase().includes(searchInput)
      );
    });

    return (
      <div className="container">
        <div className="userdetails-container">
          <input
            type="search"
            className="input-box form-control"
            placeholder="Search by name, email or role"
            value={searchInput}
            onChange={this.onChangeSearchInput}
          />
        </div>
        <table className="table">
          <tr>
            <th>
              <input
                type="checkbox"
                className="input-checkbox"
                onChange={this.onSelectAll}
              />
            </th>
            <th className="name">Name</th>
            <th className="email">E-mail</th>
            <th className="role">Role</th>
            <th className="action">Action</th>
          </tr>

          {searchResults.map((eachUserData) => (
            <tbody key={eachUserData.id}>
              {editUserDetails === eachUserData.id ? (
                <EditUsersList
                  userDetails={eachUserData}
                  saveChanges={this.saveChanges}
                  cancelChanges={this.editUserItem}
                />
              ) : (
                <ListItem
                  key={eachUserData.id}
                  usersDetails={eachUserData}
                  onDeleteItem={this.onDeleteItem}
                  onChecked={this.onChecked}
                  editUserItem={this.editUserItem}
                />
              )}
            </tbody>
          ))}
        </table>

        <div className="bottom-section">
          <button
            type="button"
            class="btn btn-danger"
            onClick={this.deletingMultipleItems}
          >
            Delete Selected
          </button>
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            pageCount={5}
            onPageChange={this.handlePageClick}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      </div>
    );
  };

  renderFailureView = () => {
    return (
      <div style={{ "text-align": "center" }}>
        <h1>No content to show, Please try again Later</h1>
      </div>
    );
  };

  renderLoaderView = () => {
    return (
      <div testid="loader">
        <Loader type="Rings" color="#ffffff" height={80} width={80} />
      </div>
    );
  };

  render() {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderUsersLists();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoaderView();
      default:
        return null;
    }
  }
}

export default UserList;
