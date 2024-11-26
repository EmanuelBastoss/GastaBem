import React, { useState } from 'react';
import './Modal.css';

function ModalEntrada({ isOpen, onClose, onSave }) {
    const [entrada, setEntrada] = useState({
        descricao: '',
        valor: '',
        categoria: '',
        data: new Date().toISOString().split('T')[0]
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Garantir que o valor seja um número válido
        const valorNumerico = Number(entrada.valor);
        if (isNaN(valorNumerico)) {
            alert('Por favor, insira um valor válido');
            return;
        }

        const entradaFormatada = {
            descricao: entrada.descricao.trim(),
            valor: valorNumerico,
            categoria: entrada.categoria,
            data: new Date(entrada.data).toISOString()
        };

        onSave(entradaFormatada);
        
        // Limpar o formulário após enviar
        setEntrada({
            descricao: '',
            valor: '',
            categoria: '',
            data: new Date().toISOString().split('T')[0]
        });
    };

    const handleValorChange = (e) => {
        const value = e.target.value;
        // Permite apenas números e um único ponto decimal
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setEntrada({...entrada, valor: value});
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Nova Entrada</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Descrição:</label>
                        <input
                            type="text"
                            value={entrada.descricao}
                            onChange={(e) => setEntrada({...entrada, descricao: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Valor:</label>
                        <input
                            type="text"
                            value={entrada.valor}
                            onChange={handleValorChange}
                            placeholder="0.00"
                            required
                            pattern="\d*\.?\d{0,2}"
                            title="Digite um valor numérico válido com até 2 casas decimais"
                        />
                    </div>
                    <div className="form-group">
                        <label>Categoria:</label>
                        <select
                            value={entrada.categoria}
                            onChange={(e) => setEntrada({...entrada, categoria: e.target.value})}
                            required
                        >
                            <option value="">Selecione uma categoria</option>
                            <option value="Salário">Salário</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Investimentos">Investimentos</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Data:</label>
                        <input
                            type="date"
                            value={entrada.data}
                            onChange={(e) => setEntrada({...entrada, data: e.target.value})}
                            required
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="btn-save">Salvar</button>
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalEntrada;