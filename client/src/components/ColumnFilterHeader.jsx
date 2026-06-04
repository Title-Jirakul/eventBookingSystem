import React from "react";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 6px 0;
`;

const HeaderLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HeaderInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 28px;
  border: 1px solid #cfd8dc;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 12px;
  line-height: 18px;
  background: #fff;

  &:focus {
    border-color: #1976d2;
    box-shadow: 0 0 0 1px #1976d2;
    outline: none;
  }
`;

export const ColumnFilterHeader = ({ label, value, onChange }) => {
  const stopGridHeaderEvent = event => {
    event.stopPropagation();
  };

  return (
    <HeaderWrapper>
      <HeaderLabel title={label}>{label}</HeaderLabel>
      <HeaderInput
        type="text"
        value={value}
        placeholder="Filter"
        onClick={stopGridHeaderEvent}
        onMouseDown={stopGridHeaderEvent}
        onKeyDown={stopGridHeaderEvent}
        onChange={event => onChange(event.target.value)}
      />
    </HeaderWrapper>
  );
};

export const addColumnFilters = (columns, filters, onFilterChange) =>
  columns.map(column => {
    if (column.filterable === false) {
      return column;
    }

    return {
      ...column,
      renderHeader: () => (
        <ColumnFilterHeader
          label={column.headerName || column.field}
          value={filters[column.field] || ""}
          onChange={value => onFilterChange(column.field, value)}
        />
      ),
    };
  });

export const filterRowsByColumnText = (rows, filters) => {
  const activeFilters = Object.entries(filters).filter(([, value]) => value.trim() !== "");

  if (activeFilters.length === 0) {
    return rows;
  }

  return rows.filter(row =>
    activeFilters.every(([field, value]) => {
      const cellValue = row[field];

      if (cellValue === undefined || cellValue === null) {
        return false;
      }

      return String(cellValue).toLowerCase().startsWith(value.trim().toLowerCase());
    })
  );
};
