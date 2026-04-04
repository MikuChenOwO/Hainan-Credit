#!/usr/bin/env python3
"""
测试后端API的调试脚本
"""

from app import get_hainan_map_option
import json

def test_map_option():
    """测试地图配置生成"""
    try:
        print("正在生成地图配置...")
        result = get_hainan_map_option()
        print("✅ 成功生成地图配置")
        print("类型:", type(result))
        
        if isinstance(result, dict):
            print("字典键:", list(result.keys()))
            
            if 'series' in result:
                series = result['series']
                print("series类型:", type(series))
                
                if isinstance(series, list) and len(series) > 0:
                    first_series = series[0]
                    print("第一个series的类型:", type(first_series))
                    
                    if isinstance(first_series, dict):
                        print("第一个series的键:", list(first_series.keys()))
                        
                        if 'data' in first_series:
                            data = first_series['data']
                            print("data类型:", type(data))
                            print("data长度:", len(data) if isinstance(data, list) else '不是列表')
                            
                            if isinstance(data, list) and len(data) > 0:
                                print("第一个数据项:", data[0])
                                print("第一个数据项类型:", type(data[0]))
        
        # 保存到文件以便查看完整结构
        with open('debug_output.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print("✅ 配置已保存到 debug_output.json")
        
        return True
        
    except Exception as e:
        print("❌ 生成地图配置时出错:", str(e))
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_map_option()