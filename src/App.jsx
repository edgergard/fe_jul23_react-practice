import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function prepareString(string) {
  return string.toLowerCase().trim();
}

const categories = categoriesFromServer.map(category => ({
  ...category,
  owner: getOwnerById(category.ownerId),
}));

const products = productsFromServer.map(product => ({
  ...product,
  category: getCategoryById(product.categoryId),
}));

export function getOwnerById(ownerId) {
  return usersFromServer.find(owner => owner.id === ownerId)
      || null;
}

export function getCategoryById(categoryId) {
  return categories.find(category => category.id === categoryId)
      || null;
}

function getPreparedProducts(productss, userState, query) {
  let preparedProducts = [...productss];

  if (userState !== 'All') {
    preparedProducts = preparedProducts.filter(
      product => product.category.owner.name === userState,
    );
  }

  if (query !== '') {
    preparedProducts = preparedProducts.filter(
      product => prepareString(product.name).includes(prepareString(query)),
    );
  }

  return preparedProducts;
}

export const App = () => {
  const [userState, setUserState] = useState('All');
  const [query, setQuery] = useState('');
  const visibleProducts = getPreparedProducts(products, userState, query);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({
                  'is-active': userState === 'All',
                })}
                onClick={() => setUserState('All')}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setUserState(user.name)}
                  className={cn({
                    'is-active': userState === user.name,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}

                  {query
                  && (
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setQuery('')}
                  />
                  )
                    }
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setQuery('');
                  setUserState('All');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            {visibleProducts.length
              ? ''
              : 'No products matching selected criteria'}
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <ProductList productss={visibleProducts} />
          </table>
        </div>
      </div>
    </div>
  );
};

export const ProductList = ({ productss }) => (
  <tbody>
    {productss.map(product => (
      <Product product={product} key={product.id} />
    ))}
  </tbody>
);

export const Product = ({ product }) => {
  const {
    id,
    name,
    category,
  } = product;

  return (
    <tr data-cy="Product">
      <td className="has-text-weight-bold" data-cy="ProductId">
        {id}
      </td>

      <td data-cy="ProductName">
        {name}
      </td>
      <td data-cy="ProductCategory">
        {`${category.icon} - ${category.title}`}
      </td>

      <td
        data-cy="ProductUser"
        className={cn({
          'has-text-link': category.owner.sex === 'm',
          'has-text-danger': category.owner.sex === 'f',
        })}
      >
        {category.owner.name}
      </td>
    </tr>
  );
};

export const UserList = ({ users, userState, setUserState }) => (
  <>
    {users.map(user => (
      <a
        data-cy="FilterUser"
        href="#/"
        onClick={() => setUserState(user.name)}
      >
        {user.name}
      </a>
    ))}
  </>
);
