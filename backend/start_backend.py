#!/usr/bin/env python3
"""
海南省信用风险预测系统 - 后端启动脚本
"""

import os
import sys
import subprocess

def check_python_version():
    """检查Python版本"""
    if sys.version_info < (3, 7):
        print("❌ 需要Python 3.7或更高版本")
        sys.exit(1)
    print("✅ Python版本检查通过")

def install_requirements():
    """安装依赖包"""
    print("📦 正在安装依赖包...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ 依赖包安装完成")
    except subprocess.CalledProcessError:
        print("❌ 依赖包安装失败")
        sys.exit(1)

def check_dependencies():
    """检查是否已安装依赖"""
    try:
        import flask
        import pyecharts
        print("✅ 依赖包已安装")
        return True
    except ImportError:
        return False

def start_server():
    """启动Flask服务器"""
    print("🚀 正在启动后端服务器...")
    try:
        # 设置环境变量
        os.environ['FLASK_ENV'] = 'development'
        
        # 启动Flask应用
        subprocess.run([sys.executable, "app.py"])
    except KeyboardInterrupt:
        print("\n👋 服务器已停止")
    except Exception as e:
        print(f"❌ 启动服务器时出错: {e}")

def main():
    """主函数"""
    print("=" * 50)
    print("海南省信用风险预测系统 - 后端服务")
    print("=" * 50)
    
    # 检查Python版本
    check_python_version()
    
    # 检查并安装依赖
    if not check_dependencies():
        install_requirements()
    
    # 启动服务器
    start_server()

if __name__ == "__main__":
    main()