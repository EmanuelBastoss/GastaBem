import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function CustomizedTables({ rows, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Descrição</StyledTableCell>
            <StyledTableCell align="right">Valor</StyledTableCell>
            <StyledTableCell align="right">Categoria</StyledTableCell>
            <StyledTableCell align="right">Data</StyledTableCell>
            <StyledTableCell align="right">Ações</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={`${row.id}-${row.tipo}`}>
              <StyledTableCell component="th" scope="row">
                {row.descricao}
              </StyledTableCell>
              <StyledTableCell align="right" style={{ color: row.tipo === 'entrada' ? 'green' : 'red' }}>
                {row.tipo === 'entrada' ? '+' : '-'} R$ {Number(row.valor).toFixed(2)}
              </StyledTableCell>
              <StyledTableCell align="right">{row.categoria}</StyledTableCell>
              <StyledTableCell align="right">{new Date(row.data).toLocaleDateString()}</StyledTableCell>
              <StyledTableCell align="right">
                <button onClick={() => onEdit(row)}>Editar</button>
                <button onClick={() => onDelete(row.id)}>Excluir</button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}