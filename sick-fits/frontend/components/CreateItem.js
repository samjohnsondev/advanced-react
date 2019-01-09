import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import Router from 'next/router';
import formatMoney from '../lib/formatMoney';
import gql from 'graphql-tag';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTAION = gql`
    mutation CREATE_ITEM_MUTAION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ){
        createItem(
            title: $title
            description: $description 
            price: $price
            image: $image
            largeImage: $largeImage
        ){
            id
        }
    }
`

class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 0
    };

    handleChange = (e) => {
        
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;

        this.setState({
            [name]: val
        })
    };

    uploadFile = async e => {
        console.log('uploading file...');
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfit');
    
        const res = await fetch('https://api.cloudinary.com/v1_1/dbulwxzey/image/upload', {
          method: 'POST',
          body: data,
        });
        const file = await res.json();
        console.log(file);
        this.setState({
          image: file.secure_url,
          largeImage: file.eager[0].secure_url,
        });
    }

    render() {
    return (  
    <Mutation mutation={CREATE_ITEM_MUTAION} variables={this.state}>
        {(createItem, {loading, error}) => (

    <Form onSubmit={async e => 
        {e.preventDefault()
            const res = await createItem();
            console.log(res);
            Router.push({
                pathname: '/item',
                query: {id: res.data.createItem.id}
            })
    }}>
        <Error error={error} />
        <fieldset disable={loading} aria-busy={loading}>
            <label htmlFor="file">
                Image
                <input 
                    type="file" 
                    multiple accept="image/*"
                    id="file" 
                    name="file" 
                    placeholder="Upload an Image" 
                    onChange={this.uploadFile}
                />
                {this.state.image && <img width="200" src={this.state.image} alt={this.state.title} />}
            </label>
            <label htmlFor="title">
                Title
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    placeholder="Title" 
                    required value={this.state.title} 
                    onChange={this.handleChange}
                />
            </label>
            <label htmlFor="price">
                Price
                <input 
                    type="number" 
                    id="price" 
                    name="price" 
                    placeholder="Price" 
                    required value={this.state.price} 
                    onChange={this.handleChange}
                />
            </label>
            <label htmlFor="description">
                Description
                <textarea 
                    id="description" 
                    name="description" 
                    placeholder="Enter a Description" 
                    required value={this.state.description} 
                    onChange={this.handleChange}
                />
            </label>
            <button type="submit">Submit</button>
        </fieldset>
    </Form>
    )}
    </Mutation>
    )
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTAION };