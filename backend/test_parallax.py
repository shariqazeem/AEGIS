#!/usr/bin/env python3
"""
AEGIS Parallax Connection Test
==============================
Run this to verify Parallax is installed and accessible
"""

import sys
import httpx
from rich.console import Console
from rich.table import Table

console = Console()

def test_parallax_connection():
    """Test connection to Parallax scheduler"""
    console.print("\n[bold blue]🔍 Testing Parallax Scheduler Connection...[/bold blue]\n")

    # Parallax scheduler default endpoint
    scheduler_url = "http://localhost:3001"

    results = Table(title="Parallax Connection Test")
    results.add_column("Endpoint", style="cyan")
    results.add_column("Status", style="magenta")
    results.add_column("Details", style="green")

    connected = False

    try:
        # Test health endpoint
        response = httpx.get(f"{scheduler_url}/health", timeout=3)

        if response.status_code == 200:
            results.add_row(f"{scheduler_url}/health", "✓ Connected", "Scheduler healthy")
            connected = True
        else:
            results.add_row(f"{scheduler_url}/health", "✗ Failed", f"Status: {response.status_code}")

    except httpx.ConnectError:
        results.add_row(f"{scheduler_url}/health", "✗ Failed", "Connection refused")
    except httpx.TimeoutException:
        results.add_row(f"{scheduler_url}/health", "✗ Failed", "Timeout (>3s)")
    except Exception as e:
        results.add_row(f"{scheduler_url}/health", "✗ Failed", str(e)[:40])

    console.print(results)
    console.print()

    if connected:
        console.print(f"[bold green]✓ Parallax scheduler is running![/bold green]")
        console.print(f"\n[yellow]Next steps:[/yellow]")
        console.print("1. Visit the Parallax UI: [cyan]http://localhost:3001[/cyan]")
        console.print("2. Download a reasoning model:")
        console.print("   • [cyan]nvidia/Llama-3.1-8B-Instruct-FP8[/cyan] (recommended, ~8GB)")
        console.print("   • [cyan]Qwen/Qwen3-0.6B[/cyan] (faster, ~600MB)")
        console.print("\n3. Make sure a worker node is joined:")
        console.print("   [dim]Run 'parallax join' in another terminal[/dim]")
        console.print("\n4. Test API access:")
        console.print("   [dim]Run this script again to verify models are loaded[/dim]")
        return True
    else:
        console.print("[bold red]✗ Parallax scheduler not detected[/bold red]")
        console.print("\n[yellow]To start Parallax:[/yellow]")
        console.print("1. Install: [cyan]https://github.com/GradientHQ/parallax[/cyan]")
        console.print("2. Activate venv: [cyan]source /path/to/parallax/venv/bin/activate[/cyan]")
        console.print("3. Start scheduler: [cyan]parallax run[/cyan]")
        console.print("4. Join worker: [cyan]parallax join[/cyan] (in new terminal)")
        console.print("5. Re-run this test")
        return False

def test_openai_api():
    """Test OpenAI-compatible API access and model availability"""
    console.print("\n[bold blue]🔍 Testing Parallax API & Models...[/bold blue]\n")

    try:
        from openai import OpenAI
        client = OpenAI(
            base_url="http://localhost:3001/v1",
            api_key="not-needed-for-local"
        )

        # Try to list models
        try:
            models = client.models.list()
            console.print("[green]✓ OpenAI-compatible API accessible[/green]")

            if models.data:
                table = Table(title="Available Models")
                table.add_column("Model ID", style="cyan")
                table.add_column("Status", style="green")

                found_reasoning = False

                for model in models.data:
                    model_id = model.id.lower()
                    status = "Available"

                    # Check if we have reasoning model (Llama 3.1 or Qwen)
                    if "llama" in model_id:
                        found_reasoning = True
                        status = "✓ Reasoning model (recommended)"
                    elif "qwen" in model_id:
                        found_reasoning = True
                        status = "✓ Reasoning model (lighter)"

                    table.add_row(model.id, status)

                console.print(table)

                # Summary
                console.print("\n[bold cyan]Note:[/bold cyan] Moondream vision model is loaded DIRECTLY by AEGIS (not via Parallax)")

                if found_reasoning:
                    console.print("\n[bold green]✓ Parallax has reasoning model ready![/bold green]")
                    console.print("AEGIS can use Parallax for threat analysis.")
                    console.print("\n[yellow]Next steps:[/yellow]")
                    console.print("1. Update [cyan]backend/vision_sentinel.py[/cyan]:")
                    console.print("   - Set [dim]config.PARALLAX_ENABLED = True[/dim]")
                    console.print("   - Set [dim]config.VISION_MODEL = 'moondream'[/dim] (or 'mock' for testing)")
                    console.print("2. Install Moondream: [dim]pip install transformers torch[/dim]")
                    console.print("3. Run: [cyan]python vision_sentinel.py[/cyan]")
                    return True
                else:
                    console.print("\n[yellow]⚠ No reasoning models found.[/yellow]")
                    console.print("Download a model via Parallax UI: [cyan]http://localhost:3001[/cyan]")
                    console.print("\nRecommended models:")
                    console.print("  • [cyan]nvidia/Llama-3.1-8B-Instruct-FP8[/cyan] (best quality, ~8GB)")
                    console.print("  • [cyan]Qwen/Qwen3-0.6B[/cyan] (fastest, ~600MB)")
                    return False
            else:
                console.print("[yellow]⚠ No models found. Download models via Parallax UI.[/yellow]")
                console.print("Visit: [cyan]http://localhost:3001[/cyan]")
                return False

        except Exception as e:
            console.print(f"[yellow]⚠ API error: {e}[/yellow]")
            console.print("Make sure Parallax scheduler is running and a worker node has joined.")
            return False

    except ImportError:
        console.print("[red]✗ OpenAI package not installed[/red]")
        console.print("Install: [cyan]pip install openai[/cyan]")
        return False

def main():
    """Run all tests"""
    console.print("[bold]=" * 50)
    console.print("🛡️  AEGIS Parallax Integration Test")
    console.print("=" * 50)

    # Test 1: Parallax connection
    parallax_ok = test_parallax_connection()

    if parallax_ok:
        # Test 2: OpenAI API
        api_ok = test_openai_api()

        if api_ok:
            console.print("\n[bold green]✓ ALL TESTS PASSED[/bold green]")
            console.print("\n[yellow]You're ready to run AEGIS with real AI![/yellow]")
            console.print("Run: [cyan]python vision_sentinel.py[/cyan]\n")
            sys.exit(0)

    console.print("\n[bold red]⚠ Some tests failed[/bold red]")
    console.print("Follow the instructions above to fix issues.\n")
    sys.exit(1)

if __name__ == "__main__":
    main()
