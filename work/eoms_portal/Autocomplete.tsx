// ** React Imports
import {ChangeEvent, ReactNode, SyntheticEvent, useCallback, useEffect, useRef, useState} from 'react'

// ** Next Imports
import {useRouter} from 'next/router'

// ** MUI Imports
import MuiAutocomplete, {AutocompleteRenderInputParams} from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import MuiDialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {styled, useTheme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import Magnify from 'mdi-material-ui/Magnify'

// ** Third Party Imports
// ** Types Imports
import {Settings} from 'src/@core/context/settingsContext'

// ** Configs Imports
// ** Custom Components Imports
// ** API Icon Import with object
import SearchResult from './SearchResult'
import useDebounce from 'src/hooks/useDebounce'

interface Props {
  hidden?: boolean
  settings: Settings
  navHover?: boolean
}
type AppBarSearchType = {
  id: number
  url: string
  icon: string
  title: string
  category: string
}


interface NoResultProps {
  value: string
  setOpenDialog: (val: boolean) => void
}

interface DefaultSuggestionsType {
  category: string
  suggestions: {
    link: string
    icon: ReactNode
    suggestion: string
  }[]
}


// ** Styled Autocomplete component
const Autocomplete = styled(MuiAutocomplete)(({ theme }) => ({
  '& fieldset': {
    border: 0
  },
  '& + .MuiAutocomplete-popper': {
    borderTop: `1px solid ${theme.palette.divider}`,
    '& .MuiAutocomplete-listbox': {
      paddingTop: 0,
      height: '100%',
      maxHeight: 'inherit',
      '& .MuiListSubheader-root': {
        top: 0,
        fontWeight: 400,
        lineHeight: '15px',
        fontSize: '0.75rem',
        letterSpacing: '1px',
        color: theme.palette.text.disabled,
        padding: theme.spacing(3.75, 6, 0.75)
      }
    },
    '& .MuiAutocomplete-paper': {
      border: 0,
      height: '100%',
      borderRadius: 0,
      boxShadow: 'none'
    },
    '& .MuiListItem-root.suggestion': {
      padding: 0,
      '& .MuiListItemSecondaryAction-root': {
        display: 'flex'
      },
      '&.Mui-focused.Mui-focusVisible, &:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '& .MuiListItemButton-root: hover': {
        backgroundColor: 'transparent'
      },
      '&:not(:hover)': {
        '& .MuiListItemSecondaryAction-root': {
          display: 'none'
        },
        '&.Mui-focused, &.Mui-focused.Mui-focusVisible:not(:hover)': {
          '& .MuiListItemSecondaryAction-root': {
            display: 'flex'
          }
        },
        [theme.breakpoints.down('sm')]: {
          '&.Mui-focused:not(.Mui-focusVisible) .MuiListItemSecondaryAction-root': {
            display: 'none'
          }
        }
      }
    },
    '& .MuiAutocomplete-noOptions': {
      display: 'grid',
      minHeight: '100%',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(10)
    }
  }
}))

// ** Styled Dialog component
const Dialog = styled(MuiDialog)({
  '& .MuiBackdrop-root': {
    backdropFilter: 'blur(4px)'
  },
  '& .MuiDialog-paper': {
    overflow: 'hidden',
    '&:not(.MuiDialog-paperFullScreen)': {
      height: '100%',
      maxHeight: 550
    }
  }
})

const NoResult = ({ value, setOpenDialog }: NoResultProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <SearchResult valueSearch={value} />
    </Box>
  )
}


const AutocompleteComponent = ({ hidden = false, settings, navHover, ...props }: Props) => {
  // ** States
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  // ** Hooks & Vars
  const theme = useTheme()
  const { layout, navCollapsed } = settings
  const wrapper = useRef<HTMLDivElement>(null)
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    setIsMounted(true)
    console.log('mounted')
    return () => setIsMounted(false)
  }, [])

  // Handle ESC & shortcut keys keydown events
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      // ** Shortcut keys to open searchbox (Ctrl + /)
      if (!openDialog && event.ctrlKey && event.which === 191) {
        setOpenDialog(true)
      }
    },
    [openDialog]
  )

  // Handle shortcut keys keyup events
  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      // ** ESC key to close searchbox
      if (openDialog && event.keyCode === 27) {
        setOpenDialog(false)
      }
    },
    [openDialog]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp, handleKeydown])

  // const debounceValue = useDebounce(searchValue)

  const handleSearchInputChange = (event: SyntheticEvent<Element, Event>, value: string) => {
    // changed
    if (searchValue.trim() != value.trim()) {
      setSearchValue(value)
    }
  }

  const handleTextFieldOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value
    if (searchValue.trim() != value.trim()) {
      setSearchValue(value)
    }
  } // changed

  if (!isMounted) {
    return null
  } else {
    return (
      <Box
        ref={wrapper}
        onClick={() => !openDialog && setOpenDialog(true)}
        sx={{
          display: 'flex',
          cursor: 'pointer',
          alignItems: 'center',
          padding: '0 22px 4px 16px'
        }}
      >
        <IconButton color='primary' sx={navHover || !navCollapsed ? {} : { ml: 2 }}>
          <Magnify />
        </IconButton>
        {!hidden && layout === 'vertical'
          ? (navHover || !navCollapsed) && <Typography sx={{ color: 'text.disabled' }}>Search (Ctrl+/)</Typography>
          : null}
        <Dialog fullWidth open={openDialog} fullScreen={fullScreenDialog} onClose={() => setOpenDialog(false)}>
          <Box sx={{ top: 0, width: '100%', position: 'sticky' }}>
            <Autocomplete
              options={[]}
              autoHighlight
              disablePortal
              id='appBar-search'
              isOptionEqualToValue={() => true}
              onInputChange={handleSearchInputChange} // changed
              noOptionsText={<NoResult value={searchValue} setOpenDialog={setOpenDialog} />} // changed
              getOptionLabel={(option: AppBarSearchType | unknown) => (option as AppBarSearchType).title}
              sx={{
                '& + .MuiAutocomplete-popper': {
                  ...(searchValue.length && {
                    overflow: 'auto'
                    // maxHeight: 'calc(100vh - 69px)',
                    // height: fullScreenDialog ? 'calc(100vh - 69px)' : 481
                  })
                }
              }}
              renderInput={(params: AutocompleteRenderInputParams) => {
                return (
                  <TextField
                    {...params}
                    value={searchValue}
                    onChange={handleTextFieldOnChange}
                    InputProps={{
                      ...params.InputProps,
                      sx: { p: `${theme.spacing(3.75, 6)} !important` },
                      startAdornment: (
                        <InputAdornment position='start' sx={{ color: 'text.primary' }}>
                          <Magnify />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment
                          position='end'
                          onClick={() => setOpenDialog(false)}
                          sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
                        >
                          {!hidden ? <Typography sx={{ mr: 2.5, color: 'text.disabled' }}>[esc]</Typography> : null}
                          <IconButton size='small' sx={{ p: 1 }}>
                            <Close fontSize='small' />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )
              }}
            />
          </Box>
          {/* {searchValue.length === 0 ? (
            <Box
              sx={{
                p: 10,
                display: 'grid',
                overflow: 'auto',
                alignItems: 'center',
                justifyContent: 'center',
                borderTop: `1px solid ${theme.palette.divider}`,
                height: fullScreenDialog ? 'calc(100vh - 69px)' : '100%'
              }}
            >
              <DefaultSuggestions setOpenDialog={setOpenDialog} />
            </Box>
          ) : null} */}
        </Dialog>
      </Box>
    )
  }
}

export default AutocompleteComponent
