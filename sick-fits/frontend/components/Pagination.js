import React from 'react'
import PaginationStyles from './styles/PaginationStyles';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection{
            aggregate{
                count
            }
        }
    }
`

const Pagination = (props) => (
    <PaginationStyles>
        <Query query={PAGINATION_QUERY}>
        {({data, loading, error}) => {
           if(loading) return <p>Loading...</p>
           const totalPages = data.itemsConnection.aggregate.count;
           const maxPages = Math.ceil(totalPages / perPage);
            return(
                <p>You are on page {maxPages} of </p>
            )
        }}
        </Query>
    </PaginationStyles>
);

export default Pagination;
