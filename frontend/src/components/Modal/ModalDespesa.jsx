import React, { useState } from 'react';
import './Modal.css';

function ModalDespesa({ isOpen, onClose, onSave }) {
    const [despesa, setDespesa] = useState({
        descricao: '',
        valor: '',
        categoria: '',
        data: new Date().toISOString().split('T')[0]
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Garantir que o valor seja um número válido
        const valorNumerico = Number(despesa.valor);
        if (isNaN(valorNumerico)) {
            alert('Por favor, insira um valor válido');
            return;
        }
        
        const despesaFormatada = {
            descricao: despesa.descricao.trim(),
            valor: valorNumerico,
            categoria: despesa.categoria,
            data: new Date(despesa.data).toISOString()
        };

        console.log('Enviando despesa:', despesaFormatada);
        onSave(despesaFormatada);
        
        // Limpar o formulário após enviar
        setDespesa({
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
            setDespesa({...despesa, valor: value});
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Nova Despesa</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Descrição:</label>
                        <input
                            type="text"
                            value={despesa.descricao}
                            onChange={(e) => setDespesa({...despesa, descricao: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Valor:</label>
                        <input
                            type="text"
                            value={despesa.valor}
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
                            value={despesa.categoria}
                            onChange={(e) => setDespesa({...despesa, categoria: e.target.value})}
                            required
                        >
                            <option value="">Selecione uma categoria</option>
                            <option value="Alimentação">Alimentação</option>
                            <option value="Transporte">Transporte</option>
                            <option value="Moradia">Moradia</option>
                            <option value="Saúde">Saúde</option>
                            <option value="Educação">Educação</option>
                            <option value="Lazer">Lazer</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Data:</label>
                        <input
                            type="date"
                            value={despesa.data}
                            onChange={(e) => setDespesa({...despesa, data: e.target.value})}
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

export default ModalDespesa;