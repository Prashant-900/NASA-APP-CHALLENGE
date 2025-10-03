import psycopg2
import pandas as pd
import plotly.express as px
import plotly.io as pio
import plotly.graph_objects as go
import json

# PostgreSQL connection parameters
conn_params = {
    "dbname": "nasa",
    "user": "postgres",
    "password": "prashantshree",
    "host": "localhost",
    "port": 5432,
}

def run_sql_and_plot(sql_query: str, python_plot_code: str, conn_params: dict) -> str:
    """
    Runs a SQL query on PostgreSQL, executes provided Python plot code with the result,
    and returns the Plotly figure JSON string.
    """
    # Step 1: Connect and fetch data
    conn = psycopg2.connect(**conn_params)
    df = pd.read_sql(sql_query, conn)
    conn.close()

    # Step 2: Prepare execution environment
    local_env = {"df": df, "pd": pd, "px": px}
    
    # Step 3: Execute plotting code (expects a variable 'fig' to be created)
    exec(python_plot_code, {}, local_env)
    
    if "fig" not in local_env:
        raise ValueError("Your plotting code must define a variable 'fig' (a Plotly figure).")
    
    fig = local_env["fig"]
    
    # Step 4: Convert Plotly figure to JSON string
    fig_json = pio.to_html(fig)
    return fig_json

if __name__ == "__main__":
    # Example SQL query
    sql_query = """
        SELECT pl_name, pl_orbper, pl_rade
        FROM k2
        WHERE pl_orbper IS NOT NULL AND pl_rade IS NOT NULL
        LIMIT 50;
    """
    
    # Example Plotly code
    python_plot_code = """
fig = px.scatter(
    df,
    x='pl_orbper',
    y='pl_rade',
    text='pl_name',
    title='Exoplanet Orbital Period vs Radius',
    labels={'pl_orbper': 'Orbital Period (days)', 'pl_rade': 'Radius (Earth radii)'}
)
fig.update_traces(textposition='top center')
"""

    # Run query and generate plot
    fig_json = run_sql_and_plot(sql_query, python_plot_code, conn_params)

    # Preview JSON string (optional)
    print("Generated JSON preview:")
    print(fig_json[:200], "...")  # preview only

    # --- Display in Python ---
