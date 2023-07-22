import React from 'react';
import PropTypes from 'prop-types';
import { setFilter } from 'redux/filterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectFilter } from 'redux/selectors';
import { selectContactsAreLoading } from 'redux/selectors';
import css from './../Phonebook.module.css';

export const ContactList = ({ contacts, deleteContactHandle }) => {
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();
  const filterContacts = (filter, contacts) => {
    return contacts.filter(
      el =>
        el.name.toLowerCase().includes(filter.toLowerCase()) ||
        el.number
          .toLowerCase()
          .trim()
          .replace(/ |-/g, '')
          .includes(filter.toLowerCase().trim().replace(/ |-/g, ''))
    );
  };
  const Entry = ({ name, number, id }) => {
    return (
      <li className={css.entry} id={id}>
        {name + ': ' + number}
        <button
          key={`${name}${number}btn${id}`}
          className={`${css.button} ${css.delete}`}
          type="button"
          onClick={e => deleteContactHandle(e, { name, number, id })}
        >
          Delete
        </button>
      </li>
    );
  };

  return (
    <div className={css.contacts}>
      <label className={css.label} htmlFor="filter">
        Find contacts
      </label>
      <input
        className={css.input}
        type="text"
        id="filter"
        name="filter"
        onChange={e => dispatch(setFilter(e.target.value.trim()))}
        value={filter}
        title="Will show only contacts that match search quota written here."
      />
      {filter ? (
        <button
          className={`${css.button} ${css.delete}`}
          type="button"
          onClick={e => dispatch(setFilter(''))}
        >
          Clear
        </button>
      ) : (
        ''
      )}
      {useSelector(selectContactsAreLoading) ? (
        <>
          <br />
          Loading changes...
        </>
      ) : (
        ''
      )}
      <ul className={css.list}>
        {filterContacts(filter, contacts).map(el => {
          return (
            <Entry
              name={el.name}
              number={el.number}
              id={`${el.id}`}
              key={`entry${el.id}`}
            />
          );
        })}
      </ul>
    </div>
  );
};

ContactList.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  deleteContactHandle: PropTypes.func.isRequired,
};
