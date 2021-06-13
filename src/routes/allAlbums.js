import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { Row, Col, Table, Button } from 'antd';
import axios from 'axios'

import { connect } from 'react-redux'
import { fetchUsers } from '../redux'

function Albums ({ userData, fetchUsers }){
    const [albumList, setAlbumList]= useState([]);
    const [loading, setLoading]= useState(false);

    const pagination = {
        pageSize: 5,
        showSizeChanger: false,
    }

    //on component mount fetch user details
    useEffect(() => {
        fetchUsers()
    }, [])

    //on change of userdata from redux store fetch album list
    useEffect(() => {
        const userList = userData.users;
        console.log(userList)
        if(
            userList.length > 0
        ){
            setLoading(true)
            axios.get("https://jsonplaceholder.typicode.com/albums",{}, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(async response => {
                const data = await response.data;
                console.log(data)
                let resultSet = data.map(album => ({
                    key: album.id,
                    id: album.id,
                    userId: album.userId,
                    userName: userList[album.userId].name,
                    title: album.title,
                }))
                setLoading(false); //set loading to False
                setAlbumList(resultSet); //set list of albums
            }).catch(function (error) {
                setLoading(false)
                console.log(error);
            });
        }
    },[userData])

    //columns for albums table
    const albumColumns = [
        {
            title: "Albums",
            dataIndex: '',
            width: '70%',
            render: record => {
                return (
                <div>
                    <p>{record.title}</p>
                    <p>Uploaded By: {record.userName}</p>
                </div>
                )
            }
        },
        {
            title:"Action",
            dataIndex:'',
            render: record => {
                return(
                    <Link to={`/albumDetails/${record.id}`}><Button type="primary">View</Button></Link>
                )
            }
        }
    ];

    return(
        <>
        <main className="albums-area" style={{margin:"30px 0"}}>
            <Row justify="center" >
                <h2>LIST OF ALBUMS</h2>
            </Row>
            <Row justify="center">
                <Col span={16}>
                    {/* all albums rendering in antd table*/}
                    <Table
                        columns={albumColumns}
                        rowKey={record => record.id}
                        dataSource={albumList}
                        pagination={pagination}
                        loading={loading}
                        size="small"
                    />
                    {/* all albums rendering in antd table*/}
                </Col>
            </Row>   
        </main>
        </>
    );
    
}

const mapStateToProps = state => {
    return {
        userData: state.user
    }
}
  
const mapDispatchToProps = dispatch => {
    return {
        fetchUsers: () => dispatch(fetchUsers())
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Albums))