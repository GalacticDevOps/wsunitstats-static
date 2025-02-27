import * as React from 'react';
import * as Constants from 'utils/constants';
import { Box, styled } from "@mui/material";
import { CheckmarksSelect } from 'components/Atoms/CheckmarksSelect';
import { useValuesToQueryStringSync } from 'components/Hooks/useValuesToQueryStringSync';
import { useOptionsController } from 'components/Hooks/useOptionsController';
import { FormButton } from 'components/Atoms/FormButton';

const FilterPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  alignItems: 'stretch',
  padding: theme.spacing(2, 1, 3, 1)
}));

const FilterButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '300px',
  height: '56px',
  gap: theme.spacing(1),
}));

export const UnitFilters = ({ filterOptions }) => {
  const { sync, clear } = useValuesToQueryStringSync();

  const nationOptionsController = useOptionsController(Constants.PARAM_NATIONS, filterOptions.nations);
  const unitTagOptionsController = useOptionsController(Constants.PARAM_UNIT_TAGS, filterOptions.unitTags);
  const searchTagOptionsController = useOptionsController(Constants.PARAM_SEARCH_TAGS, filterOptions.searchTags);

  const isAllApplied = nationOptionsController.isApplied
    && unitTagOptionsController.isApplied
    && searchTagOptionsController.isApplied;

  const hasQueryString = nationOptionsController.hasQueryString
    || unitTagOptionsController.hasQueryString
    || searchTagOptionsController.hasQueryString;

  return (
    <FilterPanel>
      <CheckmarksSelect
        sx={{ width: '300px' }}
        label='Unit Tags'
        values={unitTagOptionsController.values}
        options={unitTagOptionsController.options}
        onChange={unitTagOptionsController.setValues}
        limitTags={1}
        isOptionEqualToValue={(option, value) => option.gameId === value.gameId} />
      <CheckmarksSelect
        sx={{ width: '300px' }}
        label='Search Tags'
        values={searchTagOptionsController.values}
        options={searchTagOptionsController.options}
        onChange={searchTagOptionsController.setValues}
        limitTags={1}
        isOptionEqualToValue={(option, value) => option.gameId === value.gameId} />
      <CheckmarksSelect
        sx={{ width: '300px' }}
        label='Nations'
        values={nationOptionsController.values}
        options={nationOptionsController.options}
        onChange={nationOptionsController.setValues}
        limitTags={1}
        isOptionEqualToValue={(option, value) => option.gameId === value.gameId} />
      <FilterButtonGroup>
        <FormButton
          onClick={() => {
            const map = new Map();
            map.set(Constants.PARAM_NATIONS, nationOptionsController.values);
            map.set(Constants.PARAM_UNIT_TAGS, unitTagOptionsController.values);
            map.set(Constants.PARAM_SEARCH_TAGS, searchTagOptionsController.values);
            sync(map);
          }}
          disabled={isAllApplied}>
          APPLY
        </FormButton>
        <FormButton
          onClick={() => {
            clear([Constants.PARAM_NATIONS, Constants.PARAM_UNIT_TAGS, Constants.PARAM_SEARCH_TAGS]);
            nationOptionsController.setValues([]);
            unitTagOptionsController.setValues([]);
            searchTagOptionsController.setValues([]);
          }}
          disabled={!hasQueryString}>
          CLEAR
        </FormButton>
      </FilterButtonGroup>
    </FilterPanel>
  );
}