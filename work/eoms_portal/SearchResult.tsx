// ** React Imports
import {useEffect, useState} from 'react'

// ** MUI Imports
import {Card, Typography} from '@mui/material'
import {DataGrid, GridColumns, GridRenderCellParams} from '@mui/x-data-grid'

// ** Custom Components
// Third library
// Custom hooks
// Model
// Constraint
import {defaultPageOption} from 'src/constants/pageOptions'

// Common
import {useSelector} from 'react-redux'
import AdvancedFilterPanel from 'src/@core/components/advanced-filter-panel'
import {FieldFilterType} from 'src/@core/components/advanced-filter-panel/types'
import AdvancedPagination from 'src/@core/components/advanced-pagination'
import stylesDataGrid from 'src/@core/styles/mui/datagrid'
import {useGetResultAPI} from 'src/api/hooks/gateway.query'
import {SearchModel} from 'src/api/types/search.model'
import {SelectorAuth} from 'src/store/selector'
import {FileRemoveOutline} from 'mdi-material-ui'
import Link from 'next/link'
import useDebounce from 'src/hooks/useDebounce'

// Define type row total
type RowTotalType = {
  id: number,
  name: string,
  label: string,
  TotalQty: number
  TotalNetWeight: number
  TotalGrossWeight: number
}

// Define type row for datagrid
type RowType = SearchModel
const SearchResult = ({ valueSearch }: { valueSearch: string }) => {
  // custom hooks
  const { isError, isLoading, mutate } = useGetResultAPI<SearchModel[]>()

  //redux
  const userAccount = useSelector(SelectorAuth.selectUserAccount)
  // ** States
  const [perPage, setPerPage] = useState<number>(defaultPageOption)
  const [page, setPage] = useState<number>(1)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<RowType[]>([])
  const [data, setData] = useState<SearchModel[]>([])
  const [dataPagination, setDataPagination] = useState<RowType[]>([])

  const debounceValue = useDebounce(valueSearch) // changed

  // call api and get data, init filter
  useEffect(() => {
    // call api and get data
    mutate(
      {
        requestData: {
          serviceCode: 'PORTAL_000',
          requestQuery: {
            userAccount,
            paramList: {
              Param: {
                DocNo: valueSearch
              }
            }
          }
        }
      },
      {
        onSuccess(data, variables, context) {
          if (typeof data === 'object' && data.length) setData(data.map((item, index) => ({ ...item, id: index + 1 })))
          else setData([])
        }
      }
    )
  }, [debounceValue]) // changed

  // set data pagination when change data, page, per page
  useEffect(() => {
    const newDataPagination = data.reduce((arr: SearchModel[], item, index): SearchModel[] => {
      const totalRows = page * perPage
      if (index < totalRows && index >= totalRows - perPage) arr.push(item)

      return arr
    }, [])
    if (newDataPagination.length) setDataPagination(newDataPagination)
    else setDataPagination([])
  }, [data, page, perPage])
  //set page default when change per page
  useEffect(() => {
    setPage(1)
  }, [perPage])

  // initialize columns for datagrid
  const columns: GridColumns = [
    {
      disableColumnMenu: true,
      sortable: false,
      filterable: false,
      flex: 0.05,
      minWidth: 50,
      field: 'no',
      headerName: '#',

      renderCell: (params: GridRenderCellParams<any, RowType>) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      flex: 0.2,
      headerName: 'DOCNO',
      field: 'DOCNO',
      minWidth: 120,
      renderCell: (params: GridRenderCellParams<any, RowType>) => (
        <Link href={params.row.URL}>{(params.row as SearchModel).DOCNO}</Link>
      ),
      sortComparator: (v1: string | undefined, v2: string | undefined) => {
        if (v1 !== undefined && v2 !== undefined) return v1.localeCompare(v2)

        return 0
      }
    },
    {
      flex: 0.2,
      headerName: 'STORER KEY',
      field: 'STORERKEY',
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {(params.row as SearchModel).STORERKEY}
        </Typography>
      ),
      sortComparator: (v1: string | undefined, v2: string | undefined) => {
        if (v1 !== undefined && v2 !== undefined) return v1.localeCompare(v2)

        return 0
      }
    },
    {
      flex: 0.2,
      headerName: 'ORDER DATE',
      field: 'ORDERDATE',
      minWidth: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {(params.row as SearchModel).ORDERDATE}
        </Typography>
      ),
      sortComparator: (v1: string | undefined, v2: string | undefined) => {
        if (v1 !== undefined && v2 !== undefined) return v1.localeCompare(v2)

        return 0
      }
    },
    {
      flex: 0.2,
      headerName: 'TYPE',
      field: 'TYPE',
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {(params.row as SearchModel).TYPE}
        </Typography>
      ),
      sortComparator: (v1: string | undefined, v2: string | undefined) => {
        if (v1 !== undefined && v2 !== undefined) return v1.localeCompare(v2)

        return 0
      }
    },
    {
      flex: 0.2,
      headerName: 'WHSEID',
      field: 'WHSEID',
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {(params.row as SearchModel).WHSEID}
        </Typography>
      ),
      sortComparator: (v1: string | undefined, v2: string | undefined) => {
        if (v1 !== undefined && v2 !== undefined) return v1.localeCompare(v2)

        return 0
      }
    }
  ]

  const fieldFilters: FieldFilterType[] = [
    {
      headerName: 'ORDER KEY',
      field: 'ORDERKEY',
      type: 'date'
    },
    {
      field: 'STORERKEY',
      headerName: 'STORERKEY',
      type: 'text'
    },
    {
      headerName: 'ORDERDATE',
      field: 'ORDERDATE',
      type: 'date'
    },
    {
      field: 'QTY',
      headerName: 'QTY',
      type: 'number'
    },
    {
      field: 'NETWGT',
      headerName: 'Net Weight',
      type: 'number'
    },
    {
      field: 'GROSSWGT',
      headerName: 'Gross Weight',
      type: 'number'
    },
    {
      field: 'CUSTOMER_REF',
      headerName: 'Cust-Ref',
      type: 'text'
    },
    {
      field: 'WHSEID',
      headerName: 'WHSEID',
      type: 'text'
    }
  ]

  return (
    <>
      {data.length ? (
        <Card>
          <DataGrid
            autoHeight
            style={{ width: '600px' }}
            sx={stylesDataGrid}
            showCellRightBorder
            loading={isLoading}
            columns={columns}
            disableSelectionOnClick
            components={{
              Pagination: AdvancedPagination,
              FilterPanel: AdvancedFilterPanel
            }}
            rows={searchText ? filteredData : !isError && dataPagination != null ? dataPagination : []}
            componentsProps={{
              pagination: {
                page,
                totalPage: Math.ceil((searchText ? filteredData.length : data.length) / perPage),
                setPage,
                perPage,
                setPerPage
              },
              filterPanel: {
                fieldFilters
              }
            }}
          />
        </Card>
      ) : (
        <>
          <FileRemoveOutline sx={{ mb: 2.5, fontSize: '5rem', color: 'text.primary' }} />
          <Typography variant='h6' sx={{ mb: 11.5, wordWrap: 'break-word' }}>
            No results for{' '}
            <Typography variant='h6' component='span' sx={{ wordWrap: 'break-word' }}>
              {`"${valueSearch}"`}
            </Typography>
          </Typography>
        </>
      )}
    </>
  )
}

export default SearchResult
