import PropTypes from "prop-types";
import { Fragment, useEffect, useMemo, useState } from "react";

// material-ui
import { alpha, useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";

// third-party
import { PatternFormat } from "react-number-format";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";

// project-import
import ScrollX from "components/ScrollX";
import MainCard from "components/MainCard";
import Avatar from "components/@extended/Avatar";
import IconButton from "components/@extended/IconButton";
import EmptyReactTable from "pages/tables/react-table/empty";

import {
  DebouncedInput,
  HeaderSort,
  IndeterminateCheckbox,
  RowSelection,
  SelectColumnSorting,
  TablePagination,
} from "components/third-party/react-table";

import CustomerModal from "sections/apps/customer/CustomerModal";
import AlertCustomerDelete from "sections/apps/customer/AlertCustomerDelete";
import ExpandingUserDetail from "sections/apps/customer/ExpandingUserDetail";

import { useGetCustomer } from "api/customer";

// assets
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import useAuth from "hooks/useAuth";

const avatarImage = require.context("assets/images/users", true);

export const fuzzyFilter = (row, columnId, value, addMeta) => {
  // rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // store the ranking info
  addMeta(itemRank);

  // return if the item should be filtered in/out
  return itemRank.passed;
};

// ==============================|| REACT TABLE - LIST ||============================== //

function ReactTable({ data, columns, modalToggler }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [sorting, setSorting] = useState([
    {
      id: "id",
      desc: true,
    },
  ]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: fuzzyFilter,
    debugTable: true,
  });

  const backColor = alpha(theme.palette.primary.lighter, 0.1);
  let headers = [];
  columns.map(
    (columns) =>
      // @ts-ignore
      columns.accessorKey &&
      headers.push({
        label: typeof columns.header === "string" ? columns.header : "#",
        // @ts-ignore
        key: columns.accessorKey,
      })
  );

  return (
    <MainCard content={false}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          padding: 2,
          ...(matchDownSM && {
            "& .MuiOutlinedInput-root, & .MuiFormControl-root": {
              width: "100%",
            },
          }),
        }}
      >
        <DebouncedInput
          value={globalFilter ?? ""}
          onFilterChange={(value) => setGlobalFilter(String(value))}
          placeholder={`Search ${data?.length} records...`}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <SelectColumnSorting
            {...{
              getState: table.getState,
              getAllColumns: table.getAllColumns,
              setSorting,
            }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={modalToggler}
            >
              Invite User
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <ScrollX>
        <Stack>
          <RowSelection selected={Object.keys(rowSelection).length} />
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      if (
                        header.column.columnDef.meta !== undefined &&
                        header.column.getCanSort()
                      ) {
                        Object.assign(header.column.columnDef.meta, {
                          className:
                            header.column.columnDef.meta.className +
                            " cursor-pointer prevent-select",
                        });
                      }

                      return (
                        <TableCell
                          key={header.id}
                          {...header.column.columnDef.meta}
                          onClick={header.column.getToggleSortingHandler()}
                          {...(header.column.getCanSort() &&
                            header.column.columnDef.meta === undefined && {
                              className: "cursor-pointer prevent-select",
                            })}
                        >
                          {header.isPlaceholder ? null : (
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Box>
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </Box>
                              {header.column.getCanSort() && (
                                <HeaderSort column={header.column} />
                              )}
                            </Stack>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          {...cell.column.columnDef.meta}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {row.getIsExpanded() && (
                      <TableRow
                        sx={{
                          bgcolor: backColor,
                          "&:hover": { bgcolor: `${backColor} !important` },
                        }}
                      >
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <ExpandingUserDetail data={row.original} />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <TablePagination
                {...{
                  setPageSize: table.setPageSize,
                  setPageIndex: table.setPageIndex,
                  getState: table.getState,
                  getPageCount: table.getPageCount,
                }}
              />
            </Box>
          </>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  getHeaderProps: PropTypes.func,
  handleAdd: PropTypes.func,
  modalToggler: PropTypes.func,
  renderRowSubComponent: PropTypes.any,
};

// ==============================|| CUSTOMER LIST ||============================== //

const CustomerListPage = () => {
  const theme = useTheme();

  const { user } = useAuth();
  const { id: loginUserID, account_id: accountID } = user;

  const {
    customersLoading,
    customers: lists,
    mutate,
  } = useGetCustomer(loginUserID, accountID);

  const [open, setOpen] = useState(false);

  const [customerModal, setCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDeleteId, setCustomerDeleteId] = useState("");

  useEffect(() => {
    mutate();
  }, []);

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      },
      // {
      //   header: "#",
      //   accessorKey: "id",
      //   meta: {
      //     className: "cell-center",
      //   },
      // },
      {
        header: "User Info",
        accessorKey: "user_full_name",
        cell: ({ row, getValue }) => (
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              alt="Avatar 1"
              size="sm"
              src={avatarImage(
                `./avatar-${!row.original.avatar ? 1 : row.original.avatar}.png`
              )}
            />
            <Stack spacing={0}>
              <Typography variant="subtitle1">{getValue()}</Typography>
              <Typography color="text.secondary">
                {row.original.user_email}
              </Typography>
            </Stack>
          </Stack>
        ),
      },
      {
        header: "Contact",
        accessorKey: "user_contact_number",
        cell: ({ getValue }) => {
          const contact = getValue();
          return contact ? (
            <PatternFormat
              displayType="text"
              format="+1 (###) ###-####"
              mask="_"
              defaultValue={contact}
            />
          ) : (
            "N/A"
          );
        },
      },
      {
        header: "Actions",
        meta: {
          className: "cell-center",
        },
        disableSortBy: true,
        cell: ({ row }) => {
          return (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={0}
            >
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCustomer(row.original);
                    setCustomerModal(true);
                  }}
                >
                  <EditOutlined />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                    setCustomerDeleteId(row.original.id);
                  }}
                >
                  <DeleteOutlined />
                </IconButton>
              </Tooltip>
            </Stack>
          );
        },
      },
    ],
    // eslint-disable-next-line
    [theme]
  );

  if (customersLoading) return <EmptyReactTable />;

  return (
    <>
      <ReactTable
        {...{
          data: lists,
          columns,
          modalToggler: () => {
            setCustomerModal(true);
            setSelectedCustomer(null);
          },
        }}
      />
      <AlertCustomerDelete
        id={customerDeleteId}
        title={customerDeleteId}
        open={open}
        handleClose={handleClose}
      />
      {customerModal && (
        <CustomerModal
          open={customerModal}
          modalToggler={setCustomerModal}
          customer={selectedCustomer}
        />
      )}
    </>
  );
};

export default CustomerListPage;
