import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { Row, Col, Card } from 'antd';
import axios from 'axios'
import ReactPaginate from 'react-paginate';

import { connect } from 'react-redux'
import { fetchUsers } from '../redux'

import paginateArray from '../helpers/pagination'
// import '../assets/styles/custom.css'

function AlbumDetails (props){
    const { Meta } = Card;
    const pageSize = 9;

    const albumId = props.match.params.id;

    const [albumDetails, setAlbumDetails]= useState([]);
    const [albumPhotoList, setAlbumPhotoList]= useState([]);
    const [sortedPhotoList, setSortedPhotoList]= useState([]);

    const [loading, setLoading]= useState(false);
    const [pageCount, setPageCount]= useState(1);

    const getAlbumContents = ()=>{
        axios.get("https://jsonplaceholder.typicode.com/albums/"+albumId+"/photos",{}, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(async response => {
            const data = await response.data;
            setLoading(false)
            setAlbumPhotoList(data) //set list of albums

            setPageCount(Math.ceil(data.length / pageSize))
            console.log("pageCount - "+pageCount);
        }).catch(function (error) {
            setLoading(false)
            console.log(error);
        });
    }

    //on load of photo list sort the list
    useEffect(() => {
        let resultSet = paginateArray(albumPhotoList, pageSize, 1)

        setSortedPhotoList(resultSet)
    }, [albumPhotoList])

    //on component mount fetch user details
    useEffect(() => {
        props.fetchUsers()
    }, [])

    //on change of album id input in parameter and userdata from redux store fetch album details
    useEffect(() => {
        const userList = props.userData.users;
        console.log(userList)
        if(
            albumId != undefined  && albumId != null &&
            userList.length > 0
        ){
            setLoading(true)
            axios.get("https://jsonplaceholder.typicode.com/albums/"+albumId,{}, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(async response => {
                const data = await response.data;
                console.log(data)
                let resultSet = {
                    id: data.id,
                    userId: data.userId,
                    userName: userList[data.userId].name,
                    title: data.title,
                }
                setAlbumDetails(resultSet); //set details of albums
                getAlbumContents()
            }).catch(function (error) {
                setLoading(false)
                console.log(error);
            });
        }

    },[albumId, props.userData])

    //on page no button click created sorted array
    const handlePageClick = (data) => {
        let selectedPage = data.selected;
        let limit = Math.ceil(selectedPage * pageSize);
    
        let resultSet = paginateArray(albumPhotoList, pageSize, selectedPage)

        console.log(resultSet)
        setSortedPhotoList(resultSet)
    };

    return(
        <>
        <main className="albums-area" style={{margin:"30px 0"}}>
            <div style={{textAlign:"center"}} >
                <h2>{albumDetails.title}</h2>
                <p>Uploaded By: {albumDetails.userName}</p>
            </div>
            <Row justify="center" style={{margin:"20px 0"}}>
                <Col span={16}>
                    <Row justify="center">
                        {/* album photos rendering */}
                        {
                            sortedPhotoList &&
                            sortedPhotoList.map(photo => {
                                return(
                                    <Col span={8} style={{padding:"15px"}} key={photo.id}>
                                        <Card
                                            hoverable
                                            cover={<img alt="example" src={photo.thumbnailUrl} />}
                                        >
                                            <Meta title={photo.title} description={photo.url} />
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                        {/* album photos rendering */}
                    </Row>
                    {/* pagination row */}
                    <Row justify="center" style={{marginTop: "10px"}}>
                        <ReactPaginate
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            activeClassName={'active'}
                        />
                    </Row>
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
)(AlbumDetails))