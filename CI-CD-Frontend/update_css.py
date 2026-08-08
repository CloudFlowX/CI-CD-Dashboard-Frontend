import os
import re

directory = r'c:\Users\sunny kumar\.gemini\antigravity\scratch\cicd-dashboard\src\pages'
css_files = [
    'DashboardPage.css', 'RepositoriesPage.css', 'PipelinesPage.css', 'DeploymentsPage.css',
    'EnvironmentsPage.css', 'LogsPage.css', 'MonitoringPage.css', 'AlertsPage.css',
    'SecretsPage.css', 'SettingsPage.css', 'UsersPage.css', 'AuditLogsPage.css'
]

for filename in css_files:
    filepath = os.path.join(directory, filename)
    if not os.path.exists(filepath):
        print(f'{filename} not found')
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    has_1200 = '@media (max-width: 1200px)' in content
    has_768 = '@media (max-width: 768px)' in content
    has_576 = '@media (max-width: 576px)' in content

    classes = set(re.findall(r'\.([a-zA-Z0-9_-]+)', content))
    
    headers = [c for c in classes if 'header' in c]
    grids = [c for c in classes if 'grid' in c or 'row' in c or 'bar' in c]
    cards = [c for c in classes if 'card' in c]
    tables = [c for c in classes if 'table' in c or 'wrapper' in c or 'container' in c]
    modals = [c for c in classes if 'modal' in c or 'dialog' in c]
    inputs = [c for c in classes if 'input' in c or 'search' in c or 'filter' in c]
    buttons = [c for c in classes if 'btn' in c or 'button' in c]
    
    append_css = '\n\n/* Responsive Media Queries added by script */\n'
    
    if not has_1200:
        append_css += '@media (max-width: 1200px) {\n'
        grid_classes = [f'.{c}' for c in grids if 'grid' in c or 'row' in c]
        if grid_classes:
            classes_str = ", ".join(grid_classes[:5])
            append_css += f'  {classes_str} {{\n    grid-template-columns: repeat(2, 1fr);\n  }}\n'
        append_css += '}\n\n'
        
    if not has_768:
        append_css += '@media (max-width: 768px) {\n'
        grid_classes = [f'.{c}' for c in grids if 'grid' in c or 'row' in c]
        if grid_classes:
            classes_str = ", ".join(grid_classes[:5])
            append_css += f'  {classes_str} {{\n    grid-template-columns: 1fr;\n  }}\n'
        card_classes = [f'.{c}' for c in cards]
        if card_classes:
            classes_str = ", ".join(card_classes[:5])
            append_css += f'  {classes_str} {{\n    padding: 14px 16px;\n    gap: 12px;\n  }}\n'
        append_css += '}\n\n'
        
    if not has_576:
        append_css += '@media (max-width: 576px) {\n'
        header_classes = [f'.{c}' for c in headers if 'header' in c]
        if header_classes:
            classes_str = ", ".join(header_classes[:5])
            append_css += f'  {classes_str} {{\n    flex-direction: column;\n    align-items: stretch;\n  }}\n'
        
        append_css += '  h1, h2, h3, h4, h5, h6, [class*="title"] {\n    font-size: 80%;\n  }\n'
        
        input_classes = [f'.{c}' for c in inputs]
        if input_classes:
            classes_str = ", ".join(input_classes[:5])
            append_css += f'  {classes_str} {{\n    width: 100%;\n    flex-direction: column;\n  }}\n'
            
        table_classes = [f'.{c}' for c in tables if 'wrapper' in c or 'container' in c]
        if table_classes:
            classes_str = ", ".join(table_classes[:3])
            append_css += f'  {classes_str} {{\n    overflow-x: auto;\n  }}\n'
            
        modal_classes = [f'.{c}' for c in modals]
        if modal_classes:
            classes_str = ", ".join(modal_classes[:3])
            append_css += f'  {classes_str} {{\n    width: 95vw;\n    max-width: 95vw;\n    padding: 16px;\n  }}\n'
            
        btn_classes = [f'.{c}' for c in buttons]
        if btn_classes:
            classes_str = ", ".join(btn_classes[:5])
            append_css += f'  {classes_str} {{\n    width: 100%;\n    flex-wrap: wrap;\n  }}\n'
            
        append_css += '  * {\n    word-break: break-word;\n  }\n'
        append_css += '}\n'
        
    with open(filepath, 'a', encoding='utf-8') as f:
        f.write(append_css)
        
    print(f'Updated {filename}')
