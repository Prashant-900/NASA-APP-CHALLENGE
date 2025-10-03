from .pos_col import k2_col, cum_col, toi_col

def get_column_info(table_name: str) -> dict:
    """Get column information for a specific table"""
    column_data = {
        'k2': k2_col,
        'cum': cum_col,
        'toi': toi_col
    }
    
    if table_name not in column_data:
        return {'columns': [], 'descriptions': {}}
    
    # Parse column definitions
    lines = column_data[table_name].strip().split('\n')
    columns = []
    descriptions = {}
    
    for line in lines:
        if line.strip():
            parts = line.strip().split(' ', 1)
            if len(parts) >= 2:
                col_name = parts[0]
                col_type = parts[1]
                columns.append(col_name)
                descriptions[col_name] = col_type
    
    return {
        'table': table_name,
        'columns': columns,
        'descriptions': descriptions,
        'count': len(columns)
    }