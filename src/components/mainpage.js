import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Mainpage() {
    const [itemName, setItemName] = useState('');
    const [itemQty, setItemQty] = useState(1);
    const [itemPacked, setItemPacked] = useState(0);
    const [itemRemaining, setItemRemaining] = useState(0);
    const [sortType, setSortType] = useState(0);
    const [itemCheckBoxArr, setItemCheckBoxArr] = useState([]);
    const [listView, setListView] = useState(1);

    let navigate = useNavigate()
    let userPk = localStorage.getItem("userPk")

    // navigate to signin if username is not present
    useEffect(function () {
        let username = localStorage.getItem("username")        
        if (username === null) {
            navigate("/signin")
        }
    }, [])

    function onChangeQty(e) {
        setItemQty(parseInt(e.target.value))
    }

    function onChangeItemName(e) {
        setItemName(e.target.value)
    }

    // Create Api
    function onAdd() {
        if (itemName === '' || isNaN(itemQty) || itemQty === 0) {
            return
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        let userPk = localStorage.getItem("userPk")
        fetch(
            "http://127.0.0.1:8000/mainwork/create/",
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ itemName: itemName, itemQty: itemQty, isChecked: false, userId: userPk })
                // crossorigin: true,   
                // mode: 'no-cors'
            }
        )
            .then((res) => res.json())
            .then((data) => {
                setListView(1)
            })
            .catch((err) => console.log(err));

        setItemName('')
        setItemQty(1)

    }

    // Change Sort Type by user
    function sortMethod(e) {
        if (e.target.value === "SORT BY QTY ASC ORDER") {
            setSortType(1)
        }
        else if (e.target.value === "SORT BY QTY DEC ORDER") {
            setSortType(2)
        }
        else if (e.target.value === "SORT BY NAME DEC ORDER") {
            setSortType(3)
        }
        else if (e.target.value === "SORT BY NAME ASC ORDER") {
            setSortType(4)
        }
        else if (e.target.value === "SORT BY ENTER DATA") {
            setSortType(0)
        }
    }

    // Truncate Api
    function deleteAllCheckboxes() {

        fetch(`http://127.0.0.1:8000/mainwork/TruncateData/?userId=${userPk}`, {
            method: 'DELETE'
        })
            .then((data) => setListView(1))
            .catch((err) => console.log("error: " + err))

    }

    //Patch Api to toggle checkbox(true/false)
    function onCheckToggle(e) {
        let id = e.target.id
        let name = e.target.name
        let qty = e.target.value
        let checkedValue = e.target.checked

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        fetch(`http://127.0.0.1:8000/mainwork/update/${id}/`,
            {
                method: "PUT",
                headers: headers,
                body: JSON.stringify({ itemName: name, itemQty: qty, isChecked: checkedValue })
            }
        )
            .then((data) => data.json())
            .then((data) => {
                setListView(1)

            })
            .catch((err) => console.log("ERROR: " + err))

    }

    //Delete Api
    function onDelete(e) {
        let id = e.target.id
        fetch(`http://127.0.0.1:8000/mainwork/delete/${id}`, {
            method: "DELETE"
        }
        )
            .then((data) => {
                setListView(1)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // Delete local storage value for logout
    function logout() {
        // console.log(userPk)
        localStorage.removeItem("username")
        localStorage.removeItem("userPk")

        navigate("/signin")
    }

    //List view Api
    useEffect(function () {
        let sortedArr;
        let userPk = localStorage.getItem("userPk")

        if (listView === 1 || (sortType === 0 || 1 || 2 || 3 || 4)) {
            fetch(`http://127.0.0.1:8000/mainwork/listView/?userId=${userPk}`)
                .then((res) => res.json())
                .then((data) => {
                    sortedArr = data.slice()

                    if (sortType === 1) {
                        sortedArr.sort((a, b) => {
                            return a.itemQty - b.itemQty;
                        });
                    } else if (sortType === 2) {
                          sortedArr.sort((a, b) => {
                            return b.itemQty - a.itemQty;
                        });
                    }
                    else if (sortType === 3) {
                        sortedArr.sort((a, b) => {
                            let itemNameA = a.itemName.toLowerCase();
                            let itemNameB = b.itemName.toLowerCase();
                            if (itemNameA > itemNameB) {
                                return -1;
                            }
                            if (itemNameA < itemNameB) {
                                return 1;
                            }
                            return 0;
                        });
                    }
                    else if (sortType === 4) {

                        sortedArr.sort((a, b) => {
                            let itemNameA = a.itemName.toLowerCase();
                            let itemNameB = b.itemName.toLowerCase();

                            if (itemNameA > itemNameB) {
                                return 1;
                            }
                            if (itemNameA < itemNameB) {
                                return -1;
                            }
                            return 0;
                        });
                    } else if (sortType === 0) {
                        sortedArr = data.slice()
                    }

                    // checkbox create here
                    setItemCheckBoxArr(
                        sortedArr.map(content =>
                            <div className='check'>
                                <input type="checkbox" id={content.id} name={content.itemName} value={content.itemQty} defaultChecked={content.isChecked} onClick={onCheckToggle} />
                                <label htmlFor={content.id}>{content.itemQty} {content.itemName} </label>
                                <button onClick={onDelete} className="deletebtn" id={content.id}> ❌ </button>
                            </div>
                        ))

                    const totalQty = data.reduce((sum, arr) =>
                        sum += arr.itemQty, 0
                    )
                    const packedQty = data.reduce(
                        function (sum, arr) {
                            if (arr.isChecked === true) {
                                sum += arr.itemQty;
                            }
                            return sum;
                        }, 0
                    )
                    setItemPacked(packedQty)
                    setItemRemaining(totalQty - packedQty)
                })
                .catch((err) => console.log(err))
        }

        setListView(0)

    }, [sortType, listView])

    return (
        <>
            <div className="heading d-flex gap-3 justify-content-center py-4">
                <span className="badge text-bg-primary rounded-pill col-8"><h1>💼 FAR AWAY 🏖️</h1></span>
                <span className="py-2"><button className="btn btn-info mb-2" onClick={logout}>Logout</button>
                </span>
            </div>
            <div className="subheading text-white d-flex gap-3 justify-content-center py-3">

                <form className="form-inline">
                    <div className="form-group mb-2">
                        <h3>What do you need for your😍 trip?</h3>
                    </div>

                    <div className="form-group mx-sm-3 mb-2">
                        <label htmlFor="quantity" className="sr-only">Quantity</label>
                        <input type="number" onChange={onChangeQty} value={itemQty} className="form-control" id="quantity" placeholder="Quantity" />
                    </div>
                    <div className="form-group mx-sm-3 mb-2">
                        <label htmlFor="itemName" className="sr-only">itemName</label>
                        <input type="text" className="form-control" onChange={onChangeItemName} id="itemName" placeholder="Item Name.." />
                    </div>
                    <div className="form-group mx-sm-3 mb-2">
                        <button onClick={onAdd} className="btn btn-info mb-2">ADD ITEM</button>

                    </div>
                </form>
            </div>
            <div className='checkBoxShow'>

                {itemCheckBoxArr}

            </div>

            <footer className="bg-body-tertiary justify-content-center ">
                <div className="d-flex gap-5 justify-content-center py-3">

                    <div className='sortAndClearbtn text-white w-25'>

                        <select className='sortSelection inputAndBtnDesign justify-content-center text-white' onChange={sortMethod} id="filter">
                            <option value="SORT BY ENTER DATA" defaultValue>SORT BY ENTER DATA</option>
                            <option value="SORT BY QTY ASC ORDER">SORT BY QTY ASC ORDER</option>
                            <option value="SORT BY QTY DEC ORDER">SORT BY QTY DEC ORDER</option>
                            <option value="SORT BY NAME ASC ORDER">SORT BY NAME ASC ORDER</option>
                            <option value="SORT BY NAME DEC ORDER">SORT BY NAME DEC ORDER</option>

                        </select>
                        {/* <button onClick={deleteAllCheckboxes} id="1" className='clearListBtn inputAndBtnDesign '>CLEAR LIST</button> */}
                    <button onClick={deleteAllCheckboxes} id="1" className='btn text-white justify-content-center color '>CLEAR LIST</button>

                    </div>

                </div>
            </footer>
            <footer className="footer py-4 subheading footer-line justify-content-center ">
                <div className="containerFooter">
                    <span className="text-white"><h3> 🏠You have {itemRemaining} item on your list,and you already packed {itemPacked}</h3></span>
                </div>
            </footer>

        </>
    )
}

export default Mainpage;
