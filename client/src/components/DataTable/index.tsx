import * as React from 'react';
import returnof from 'returnof';
import { TableCell, TableBody, Table, TableRow, TableHead, CircularProgress, StyledComponentProps, withStyles, WithStyles } from 'material-ui';
import TableFooter from 'material-ui/Table/TableFooter';
import TablePagination from 'material-ui/Table/TablePagination';
import { Theme } from 'material-ui/styles';
import * as classNames from 'classnames';

type SpecialColumns = 'edit' | 'view' | 'exc';

const styles = (theme: Theme) => ({
  table: {
    padding: `0 ${theme.spacing.unit}px`,
  },

  tableHead: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },

  headerCell: {
    padding: '0 !important',
    verticalAlign: 'top',
    border: 'none',
  },

  header: {
    background: '#2DB5AD',
    borderBottom: `solid 1px ${theme.palette.common.black}`,
    height: 48,
  },

  heading: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
    color: '#fff',
    fontSize: '16px',
    textTransform: 'uppercase',
    margin: 0,
    width: 'calc(100% - 48x)',
  },

  tableRow: {
    '&:nth-child(2n)': {
      background: '#eee',
    },

    [theme.breakpoints.down('md')]: {
      // marginBottom: theme.spacing.unit * 2,
      borderBottom: 'solid 1px #000',
      display: 'block',
      height: 'auto',
    },
  },

  tableCell: {
    padding: `0 ${theme.spacing.unit}px`,
    whiteSpace: 'nowrap',

    '&:first-child': {
      paddingLeft: `${theme.spacing.unit * 3}px`,
    },

    '&:last-child': {
      paddingRight: `${theme.spacing.unit * 3}px`,
    },

    [theme.breakpoints.down('md')]: {
      display: 'block',
      padding: `${theme.spacing.unit}px !important`,
      whiteSpace: 'inherit',
      lineHeight: '24px',

      '&:before': {
        content: 'attr(data-title)',
      },
    },
  } as React.CSSProperties,

  tableCellValue: {
    [theme.breakpoints.down('md')]: {
      float: 'right',
    },
  } as React.CSSProperties,

  ellipsis: {
    maxWidth: 100,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',

    [theme.breakpoints.down('md')]: {
      maxWidth: 'unset',
      whiteSpace: 'inherit',
    },
  } as React.CSSProperties,
});

const styleReturn = returnof(styles);

export interface DataTableColumn<TRow extends { id: string }> {
  name: keyof TRow | SpecialColumns;
  title: string;
  width?: number;
  cell?: (row: TRow) => JSX.Element | string;
  text?: (row: TRow) => string;
  disablePadding?: boolean;
  numeric?: boolean;
  ellipsis?: boolean;
}

export interface ColumnState {
  name: string;
  width: number;
  visible: boolean;
}

interface Props<TRow extends { id: string }> {
  columns: ReadonlyArray<DataTableColumn<TRow>>;
  query?: any;
  staticRows?: ReadonlyArray<any>;
  fetch?(take: number, skip: number, query?: any): Promise<{ items: ReadonlyArray<TRow>, totalCount: number }>;
}

export {
  Props as DataTableProps,
};

type PropsWithStyles<TRow extends { id: string }> = Props<TRow> & WithStyles<keyof typeof styleReturn>;

interface State<TRow> {
  rows: ReadonlyArray<TRow>;
  totalCount: number;
  pageSize: number;
  currentPage: number;
  loading: boolean;
}

interface EnhancedTableHeadProps<TRow extends { id: string }> extends StyledComponentProps<keyof typeof styleReturn> {
  columns: ReadonlyArray<DataTableColumn<TRow>>;
}

const EnhancedTableHead = withStyles(styles)(
  function <TRow extends { id: string }>({ columns, classes }: EnhancedTableHeadProps<TRow>) {
    if (!classes) return null;

    return (
      <TableHead className={classes.tableHead}>
        <TableRow>
          {columns.map((column) =>
            <TableCell key={column.name} numeric={column.numeric} className={classes.tableCell}>
              {column.title}
            </TableCell>,
          )}
        </TableRow>
      </TableHead>
    );
  },
);

export const DataTable = withStyles(styles)(
  class <TRow extends { id: string }> extends React.PureComponent<PropsWithStyles<TRow>, State<TRow>> {
    private lastQueryHash: string = '';

    constructor(props: PropsWithStyles<TRow>) {
      super(props);

      this.state = {
        rows: [],
        totalCount: 0,
        pageSize: 10,
        currentPage: 0,
        loading: !props.staticRows,
      };
    }

    componentDidMount() {
      this.loadData();
    }

    componentDidUpdate() {
      this.loadData();
    }

    async loadData() {
      if (!this.props.fetch) return;

      const { pageSize, currentPage } = this.state;

      const take = pageSize;
      const skip = pageSize * currentPage;
      const query = this.props.query;

      const queryHash = JSON.stringify({ take, skip, query });

      if (queryHash === this.lastQueryHash) {
        this.setState({ loading: false });
        return;
      }

      this.lastQueryHash = queryHash;

      try {
        const data = await this.props.fetch(take, skip, this.props.query);

        this.setState({
          rows: data.items,
          totalCount: data.totalCount,
          loading: false,
        });
      } catch (err) {
        console.error(err);

        this.setState({ loading: false });
      }
    }

    getRows() {
      return this.props.staticRows || this.state.rows;
    }

    changePage(page: number) {
      if (page < 0) page = 0;

      this.setState({
        loading: true,
        currentPage: page,
      });

      this.loadData();
    }

    changeRowsPerPage(rowsPerPage: number) {
      this.setState({
        pageSize: rowsPerPage,
      });

      this.loadData();
    }

    renderCell(col: DataTableColumn<TRow>, row: any) {
      if (col.cell) {
        return col.cell(row);
      }

      return this.getCellText(col, row);
    }

    getCellText(col: DataTableColumn<TRow>, row: any): string {
      if (col.text) {
        return col.text(row);
      }

      return typeof row[col.name] !== 'undefined' ? String(row[col.name]) : '';
    }

    render() {
      const { columns, fetch, classes } = this.props;

      const { pageSize, currentPage, totalCount, loading } = this.state;

      const rows = this.getRows();

      return (
        <div style={{ overflowX: 'auto' }}>
          {loading && <CircularProgress />}

          <Table className={classes.table}>
            <EnhancedTableHead
              columns={columns as any} />

            <TableBody>
              {
                rows.map((row, index) =>
                  <TableRow key={index} className={classes.tableRow}>
                    {columns.map((col, index) =>
                      <TableCell key={index} data-title={col.title} className={classNames(classes.tableCell, col.ellipsis && classes.ellipsis)} title={col.ellipsis && row[col.name]}>
                        <span className={classes.tableCellValue}>{this.renderCell(col, row)}</span>
                      </TableCell>,
                    )}
                  </TableRow>,
                )
              }
            </TableBody>

            {
              fetch ?
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      count={totalCount}
                      rowsPerPage={pageSize}
                      page={currentPage}
                      onChangePage={(_e, page) => this.changePage(page)}
                      onChangeRowsPerPage={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => this.changeRowsPerPage(parseInt(e.currentTarget.value, 10))}
                    />
                  </TableRow>
                </TableFooter>
                : null
            }
          </Table>
        </div>
      );
    }
  },
);
