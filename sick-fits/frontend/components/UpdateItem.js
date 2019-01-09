import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Form from './styles/Form';
import Router from 'next/router';
import formatMoney from '../lib/formatMoney';
import gql from 'graphql-tag';
import Error from './ErrorMessage';

const SINGE_ITEM_QUERY = gql`
    query SINGE_ITEM_QUERY($id: ID!){
        item(where: {id: $id}){
            id
            title
            description
            price
        }
    }
`

const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $price: Int
        
    ){
        updateItem(
            id: $id
            title: $title
            description: $description 
            price: $price
           
        ){
            id
            title
            description
            price
        }
    }
`

class UpdateItem extends Component {
    state = {};

    handleChange = (e) => {
        
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;

        this.setState({
            [name]: val
        })
    };


    updateItem = async (e, updateItemMutation) => {
        e.preventDefault();
        console.log('UPDATING ITEM');
        console.log(this.state);

        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state
            }
        });

        console.log('FULLY UPDATEd')
    }
    
    render() {
    return (  
    <Query query={SINGE_ITEM_QUERY} variables={{id: this.props.id}}>
        {({data, loading}) => {
            console.log(data);
            if(loading) <p>Loading...</p>
            if(!data.title) <p>No data found for {this.props.id}</p>
            return (
                
    <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
        {(updateItem, {loading, error}) => (

    <Form onSubmit={e => this.updateItem(e, updateItem)}>
        <Error error={error} />
        <fieldset disable={loading} aria-busy={loading}>
            <label htmlFor="title">
                Title
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    placeholder="Title" 
                    required defaultValue={data.item.title} 
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
                    required defaultValue={data.item.price} 
                    onChange={this.handleChange}
                />
            </label>
            <label htmlFor="description">
                Description
                <textarea 
                    id="description" 
                    name="description" 
                    placeholder="Enter a Description" 
                    required defaultValue={data.item.description} 
                    onChange={this.handleChange}
                />
            </label>
            <button type="submit">Save Changes</button>
        </fieldset>
    </Form>
    )}
    </Mutation>
          )
        }}
    </Query>
    )
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };